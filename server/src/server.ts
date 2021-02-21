import * as socketio from 'socket.io';

const io = new socketio.Server(7000, {
  cors: {
    origin: "http://127.0.0.1:5000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', client => {
  console.log('Connected!');
  client.on('hello', () => {
    console.log('Client says hello!')
  })
});

console.log('Galaxy of Gangs!');