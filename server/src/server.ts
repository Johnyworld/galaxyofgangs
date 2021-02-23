import * as socketio from 'socket.io';

class App {
  io: socketio.Server;
  port: number;
  constructor() {
    this.port = 7000;
    console.log(`✅ Galaxy of Gangs server listening port ${this.port}`);

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
    console.log('Client says hello!', payload);
    client.join('channel-01')
  }
}

new App();
