
class Socket {
  socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io('http://localhost:7000', { autoConnect: false });
    this.connect();
  }

  connect() {
    this.socket.connect();
  }

  on(event: string, fn: Function) {
    this.socket.on(event, fn);
  }

  hello() {
    this.socket.emit('hello', {
      username: 'Johny Kim',
    })
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

    this.resize();

    this.socket.on('gameState', (state: any) => this.update(state));

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
  }

  update(state: any) {
    console.log('state', state);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(50, 50, 50, 50);
  }
}


window.onload = () => {
  new App();
}

