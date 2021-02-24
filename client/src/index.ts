import { State } from 'state';

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

  emit(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}


class KeyEvent {
  constructor(username: string, socket: Socket) {
    ['keydown', 'keyup'].forEach(eventName => {
      window.addEventListener(eventName, (e:any) => {
        if ( ['KeyA', 'KeyS', 'KeyD', 'KeyW', 'Space'].includes(e.code) ) {
          e.preventDefault();
          console.log(e.code);
          socket.emit('keyevent', { username, eventName, code: e.code });
        }
      })
    })
  }
}


class App {
  socket: Socket;
  keyEvent: KeyEvent;
  state: State;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.socket = new Socket();
    this.state = {
      spacecrafts: [],
    };
    this.socket.emit('hello', { username: 'Johny Kim' });
    this.keyEvent = new KeyEvent('Johny Kim', this.socket);

    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');

    this.resize();

    this.socket.on('gameState', (state: State) => this.update(state));

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
  }

  update(state: State) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'red';
    for ( const ship of state.spacecrafts ) {
      this.ctx.fillRect(ship.pos.x, ship.pos.y, 50, 50);
    }
  }
}


window.onload = () => {
  new App();
}

