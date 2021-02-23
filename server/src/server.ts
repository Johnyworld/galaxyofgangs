import * as socketio from 'socket.io';
import Spacecraft from './classes/entities/Spacecraft';
import State from './classes/states/State';

class App {
  io: socketio.Server;
  state: State;
  port: number;
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
  }

  sayHello(client: any, payload: any) {
    const newPlayer = new Spacecraft(payload.username);
    const connectingChannel = this.state.channels[0].channel;
    client.join(connectingChannel);
    const channel = this.state.channels.find(ch => ch.channel === connectingChannel);
    channel?.createNewSpacecraft(newPlayer);
    console.log(`${payload.username} 유저가 ${connectingChannel} 채널에 입장했습니다.`, payload);
    console.log(this.state.channels)
  }
}

new App();
