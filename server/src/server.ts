import * as socketio from 'socket.io';
import Spacecraft from './classes/entities/Spacecraft';
import State from './classes/states/State';

const FRAME_RATE = 60;
let playerNum = 1;

console.log('hello');

class App {
  io: socketio.Server;
  state: State;
  port: number | string;
  gameInterval:NodeJS.Timeout;
  constructor() {
    this.port = process.env.PORT ? +process.env.PORT : 7000;
    console.log(`✅ Galaxy of Gangs server listening port ${this.port}`);

    this.state = new State();

    this.state.createNewChannel();

    this.io = new socketio.Server(this.port, {
      cors: {
        origin: ['https://galaxyofgangs.herokuapp.com', 'http://127.0.0.1:5000'],
        methods: ["GET", "POST"],
        credentials: true
      }
    }) 

    this.io.on('connection', client => {
      client.on('hello', (payload:any) => this.sayHello(client, payload));
      client.on('keyEvent', (payload: any) => this.keyEvent(client, payload));
      client.on('mouseEvent', (payload: any) => this.mouseEvent(client, payload));
      client.on('disconnect', () => {
        for (const channelIndex in this.state.channels) {
          for (const ship of this.state.channels[channelIndex].spacecrafts) {
            if ( ship.id === client.id ) {
              this.state.channels[channelIndex].removeSpacecraft(client.id);
              break;
            }
          }
        }
      }) 
    });

    this.gameInterval = setInterval(() => {
      for ( const channel of this.state.channels ) {
        for ( const ship of channel.spacecrafts ) {
          if ( ship.status.hp < 0 ) {
            channel.removeSpacecraft(ship.id);
          }
          ship.update();
          // for ( const otherShip of channel.spacecrafts ) {
          //   if ( otherShip.id !== ship.id ) {
          //     const left = otherShip.pos.x < ship.pos.x + ship.size.x;
          //     const top = otherShip.pos.y < ship.pos.y + ship.size.y;
          //     const right = otherShip.pos.x + otherShip.size.x > ship.pos.x;
          //     const bottom = otherShip.pos.y + otherShip.size.y > ship.pos.y;
          //     if ( left && top && right && bottom ) {
          //     }
          //   }
          // }
        }
        for ( const cannonBall of channel.cannonBalls ) {
          for ( const ship of channel.spacecrafts ) {
            if ( cannonBall.shipId !== ship.id ) {
              const left = ship.pos.x < cannonBall.pos.x + cannonBall.size.x;
              const top = ship.pos.y < cannonBall.pos.y + cannonBall.size.y;
              const right = ship.pos.x + ship.size.x > cannonBall.pos.x;
              const bottom = ship.pos.y + ship.size.y > cannonBall.pos.y;
              if ( left && top && right && bottom ) {
                ship.hit(cannonBall.dir, cannonBall.speed, cannonBall.power);
                channel.removeCannonBall(cannonBall.id);
                channel.createHits(cannonBall.pos.x, cannonBall.pos.y, cannonBall.power);
              }
            }
          }
          if ( cannonBall.distance <= 0 ) {
            channel.removeCannonBall(cannonBall.id);
          }
          cannonBall.update();
        }

        for ( const hit of channel.hits ) {
          if ( hit.showing > hit.delay ) {
            channel.removeHits(hit.id);
          }
          hit.update();
        }

        this.io.in(channel.channel.toString()).emit('gameState', channel);
      }
    }, 1000 / FRAME_RATE);
  }

  keyEvent(client: any, payload: any) {
    const channel = this.state.channels[0];
    const target = channel.spacecrafts.find(ship=> ship.id === payload.id);

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
    const target = this.state.channels[0].spacecrafts.find(ship=> ship.id === payload.id);

    if ( payload.eventName === 'mousemove' ) {
      target?.cannon.turn(payload.mouse.x, payload.mouse.y, payload.center.x, payload.center.y);
    }
  }

  sayHello(client: any, payload: any) {
    const newPlayer = new Spacecraft(client.id, payload.username + ' ' + playerNum);
    playerNum++;
    const connectingChannel = this.state.channels[0].channel;
    client.join(connectingChannel);
    const channel = this.state.channels.find(ch => ch.channel === connectingChannel);
    channel?.createNewSpacecraft(newPlayer);
    console.log(`${payload.username}(${client.id}) 유저가 ${connectingChannel} 채널에 입장했습니다.`, payload);
    this.io.emit('createdUser', newPlayer);
  }
}

new App();
