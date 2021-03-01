import { Spacecraft, State } from 'state';


const UI_BASELINE = 20;
const UI_GAP = 16;
const UI_FONT_NORMAL = 16;
const UI_FONT_SMALL = 12;
const UI_FONT_COLOR = '#0090ff';


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
          socket.emit('keyEvent', { username, eventName, code: e.code });
        }
      })
    })
  }
}


class MouseEvent {
  constructor(username: string, socket: Socket) {
    ['mousemove'].forEach(eventName => {
      window.addEventListener(eventName, (e: any) => {
        socket.emit('mouseEvent', { username, eventName, mouse: { x: e.clientX, y: e.clientY }});
      })
    })
  }
}


class App {
  myShip: string;
  socket: Socket;
  keyEvent: KeyEvent;
  mouseEvent: MouseEvent;
  state: State;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  isLoaded: boolean;
  constructor() {
    this.myShip = 'Johny Kim'
    this.socket = new Socket();
    this.isLoaded = false;

    this.state = {
      spacecrafts: [],
      cannonBalls: [],
    };

    this.socket.emit('hello', { username: this.myShip });
    this.keyEvent = new KeyEvent(this.myShip, this.socket);
    this.mouseEvent = new MouseEvent(this.myShip, this.socket);

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

  drawUI(ship: Spacecraft) {
    this.ctx.font = `italic 900 ${UI_FONT_NORMAL}px Roboto`;
    this.ctx.textBaseline = 'hanging';
    this.ctx.textAlign = 'start';
    const arr = [
      {
        name: 'HP',
        value: ship.status.hp,
        max: ship.status.hpMax,
      }, {
        name: 'FUEL',
        value: ship.status.fuel,
        max: ship.status.fuelMax,
      }
    ];
    for (let i=0; i<arr.length; i++) {
      const itemBaseLine = UI_BASELINE + UI_FONT_NORMAL*i + UI_GAP*i
      this.ctx.save();
      this.ctx.fillStyle = UI_FONT_COLOR;
      this.ctx.fillText(arr[i].name, UI_BASELINE, itemBaseLine + 2 );
      this.ctx.fillText(arr[i].max.toString(), UI_BASELINE + 80 + arr[i].max, itemBaseLine + 2 );
      this.ctx.transform(1, 0, -0.5, 1, i*UI_FONT_NORMAL, 0);
      this.ctx.fillStyle = '#1e1e1e';
      this.ctx.fillRect(UI_BASELINE + 80, itemBaseLine, arr[i].max, 16);
      this.ctx.fillStyle = UI_FONT_COLOR;
      this.ctx.fillRect(UI_BASELINE + 80, itemBaseLine, arr[i].value, 16);
      this.ctx.restore();
    }

    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = UI_FONT_COLOR;
    const dirFloor = Math.floor(ship.dir);
    const dir = dirFloor < 10 ? `00${dirFloor}` : dirFloor < 100 ? `0${dirFloor}` : `${dirFloor}`;
    this.ctx.fillText(dir, this.canvas.width/2, UI_BASELINE + 2 );

    const barSize = 100;

    const barGap = 2;
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.save();
    this.ctx.transform(1, 0, 0.5, 1, -UI_FONT_NORMAL, 0);
    this.ctx.fillRect(this.canvas.width/2 - barSize - UI_GAP - 20, UI_BASELINE, barSize, UI_FONT_NORMAL);
    this.ctx.restore();
    this.ctx.save();
    this.ctx.transform(1, 0, -0.5, 1, UI_FONT_NORMAL, 0);
    this.ctx.fillRect(this.canvas.width/2 + UI_GAP + 20, UI_BASELINE, barSize, UI_FONT_NORMAL);
    this.ctx.restore();

    const turnPower = ship.vel.turn < 0 ? Math.ceil(-ship.vel.turn) : Math.ceil(ship.vel.turn);

    for ( let i=0; i<turnPower; i++ ) {
      this.ctx.save();
      this.ctx.fillStyle = UI_FONT_COLOR;
      if ( ship.vel.turn < 0 ) {
        this.ctx.transform(1, 0, 0.5, 1, -UI_FONT_NORMAL, 0);
        this.ctx.fillRect(this.canvas.width/2 - barSize/10*(i+1) - UI_GAP - 20, UI_BASELINE, barSize/10-barGap, UI_FONT_NORMAL);
      } else {
        this.ctx.transform(1, 0, -0.5, 1, UI_FONT_NORMAL, 0);
        this.ctx.fillRect(this.canvas.width/2 + barSize/10*i + UI_GAP + 20, UI_BASELINE, barSize/10-barGap, UI_FONT_NORMAL);
      }
      this.ctx.restore();
    }

    this.ctx.fillStyle = UI_FONT_COLOR;
    this.ctx.fillRect(this.canvas.width/2, UI_BASELINE * 3, ship.vel.drive*10, 2);

  }

  update(state: State) {
    if ( this.isLoaded ) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'red';

      for ( const ship of state.spacecrafts ) {
        if ( ship.username === this.myShip ) {
          this.drawUI(ship);
        }
        const centerX = ship.pos.x + ship.size.x / 2;
        const centerY = ship.pos.y + ship.size.y / 2;
        // this.ctx.fillRect(ship.pos.x, ship.pos.y, 50, 50);
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(ship.dir * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.drawImage(this.image, 0, 0, 96, 96, ship.pos.x, ship.pos.y, ship.size.x, ship.size.y);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(ship.cannon.dir * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.drawImage(this.image, 96, 0, 96, 96, ship.cannon.pos.x, ship.cannon.pos.y, ship.cannon.size.x, ship.cannon.size.y);
        this.ctx.restore();
      }

      for ( const cannonBall of state.cannonBalls ) {
        const x = cannonBall.pos.x - cannonBall.size.x / 2;
        const y = cannonBall.pos.y - cannonBall.size.y / 2;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, cannonBall.size.x, cannonBall.size.y);
      }
    }
  }
}


window.onload = () => {
  new App();
}

