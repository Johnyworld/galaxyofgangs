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
  image: HTMLImageElement;
  isLoaded: boolean;
  constructor() {
    this.socket = new Socket();
    this.isLoaded = false;

    this.state = {
      spacecrafts: [],
    };
    this.socket.emit('hello', { username: 'Johny Kim' });
    this.keyEvent = new KeyEvent('Johny Kim', this.socket);

    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.resize();

    this.socket.on('gameState', (state: State) => this.update(state));

    this.image = new Image();
    this.image.onload = () => {
      this.isLoaded = true;
    }
    this.image.src = '/assets/spacecraft.png';

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
  }

  update(state: State) {
    if ( this.isLoaded ) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'red';
      for ( const ship of state.spacecrafts ) {
        const centerX = ship.pos.x + ship.size.x / 2;
        const centerY = ship.pos.y + ship.size.y / 2;
        // this.ctx.fillRect(ship.pos.x, ship.pos.y, 50, 50);
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(ship.dir * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.drawImage(this.image, 0, 0, 96, 96, ship.pos.x, ship.pos.y, ship.size.x, ship.size.y);
        this.ctx.restore();
      }
    }
  }
}


window.onload = () => {
  new App();
}

