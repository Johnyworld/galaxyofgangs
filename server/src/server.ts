import * as socketio from 'socket.io';
import Spacecraft from './classes/entities/Spacecraft';
import State from './classes/states/State';

const FRAME_RATE = 30;

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
        origin: "http://127.0.0.1:5000",
        methods: ["GET", "POST"]
      }
    }) 

    this.io.on('connection', client => {
      console.log(`User connected id: ${client.id}`);
      client.on('hello', (payload:any) => this.sayHello(client, payload));
    });

    this.gameInterval = setInterval(() => {
      for ( const channel of this.state.channels ) {
        this.io.in(channel.channel.toString()).emit('gameState', channel);
      }
    }, 1000 / FRAME_RATE);
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
