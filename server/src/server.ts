import * as socketio from 'socket.io';
import Spacecraft from './classes/entities/Spacecraft';
import State from './classes/states/State';

const FRAME_RATE = 60;

class App {
  io: socketio.Server;
  state: State;
  port: number;
  gameInterval:NodeJS.Timeout;
  constructor() {
    this.port = 7000;
    console.log(`✅ Galaxy of Gangs server listening port ${this.port}`);

    this.state = new State();

    this.state.createNewChannel();

    this.io = new socketio.Server(this.port, {
      cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
      }
    }) 

    this.io.on('connection', client => {
      console.log(`User connected id: ${client.id}`);
      client.on('hello', (payload:any) => this.sayHello(client, payload));
      client.on('keyEvent', (payload: any) => this.keyEvent(client, payload));
      client.on('mouseEvent', (payload: any) => this.mouseEvent(client, payload));
    });

    this.gameInterval = setInterval(() => {
      for ( const channel of this.state.channels ) {
        for ( const ship of channel.spacecrafts ) {
          ship.update();
        }
        for ( const cannonBall of channel.cannonBalls ) {
          if ( cannonBall.distance <= 0 ) {
            channel.removeCannonBall(cannonBall.id);
          }
          cannonBall.update();
        }
        this.io.in(channel.channel.toString()).emit('gameState', channel);
      }
    }, 1000 / FRAME_RATE);
  }

  keyEvent(client: any, payload: any) {
    const channel = this.state.channels[0];
    const target = channel.spacecrafts.find(ship=> ship.username === payload.username);

    if ( payload.eventName === 'keydown' ) {
      if ( payload.code === 'KeyW' ) target?.accelate(1);
      if ( payload.code === 'KeyS' ) target?.accelate(-1);
      if ( payload.code === 'KeyA' ) target?.turn(-1);
      if ( payload.code === 'KeyD' ) target?.turn(1);
      if ( payload.code === 'Space' ) target?.fire(channel);
    }

    if ( payload.eventName === 'keyup' ) {
      if ( payload.code === 'KeyW' ) target?.accelate(0);
      if ( payload.code === 'KeyS' ) target?.accelate(0);
      if ( payload.code === 'KeyA' ) target?.turn(0);
      if ( payload.code === 'KeyD' ) target?.turn(0);
    }
  }

  mouseEvent(client: any, payload: any) {
    const target = this.state.channels[0].spacecrafts.find(ship=> ship.username === payload.username);

    if ( payload.eventName === 'mousemove' ) {
      target?.cannon.turn(payload.mouse.x, payload.mouse.y, payload.center.x, payload.center.y);
    }
  }

  sayHello(client: any, payload: any) {
    const newPlayer = new Spacecraft(payload.username);
    const connectingChannel = this.state.channels[0].channel;
    client.join(connectingChannel);
    const channel = this.state.channels.find(ch => ch.channel === connectingChannel);
    channel?.createNewSpacecraft(newPlayer);
    console.log(`${payload.username}(${client.id}) 유저가 ${connectingChannel} 채널에 입장했습니다.`, payload);
    console.log(this.state.channels)
  }
}

new App();
