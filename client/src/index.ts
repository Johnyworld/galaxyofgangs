let title = <HTMLElement> document.getElementById('title');
title.style.color = 'violet';
title.innerText = 'Hello Galaxy!'

class Socket {
  socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io('http://localhost:7000', { autoConnect: false });
    this.connect();
  }

  connect() {
    this.socket.connect();
  }

  hello() {
    this.socket.emit('hello', () => {
      console.log('connection?')
    });
  }
}


class App {
  socket: Socket;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.socket = new Socket();
    this.socket.hello();
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(50, 50, 50, 50);
  }

  draw() {
  }
}


window.onload = () => {
  new App();
}

