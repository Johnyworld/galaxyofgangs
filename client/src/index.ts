import { Spacecraft, State, Vec2 } from 'state';


const UI_BASELINE = 20;
const UI_GAP = 16;
const UI_FONT_NORMAL = 16;
const UI_FONT_SMALL = 13;
const UI_FONT_COLOR = '#0090ff';
const UI_FONT_COLOR_GRAY = '#888';
const BG_GRID_SIZE = 200;
const BG_GRID_COLOR = '#222';


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
  constructor(id: string, socket: Socket) {
    ['keydown', 'keyup'].forEach(eventName => {
      window.addEventListener(eventName, (e:any) => {
        if ( ['KeyA', 'KeyS', 'KeyD', 'KeyW', 'Space'].includes(e.code) ) {
          e.preventDefault();
          console.log(e.code);
          socket.emit('keyEvent', { id, eventName, code: e.code });
        }
      })
    })
  }
}


class MouseEvent {
  center: Vec2;
  constructor(id: string, socket: Socket, canvas: HTMLCanvasElement) {
    this.center = { x: canvas.width/2, y: canvas.height/2 };
    ['mousemove'].forEach(eventName => {
      window.addEventListener(eventName, (e: any) => {
        socket.emit('mouseEvent', { id, eventName, mouse: { x: e.clientX, y: e.clientY }, center: this.center });
      })
    })
  }

  setCenterPosition(canvas: HTMLCanvasElement) {
    this.center = { x: canvas.width/2, y: canvas.height/2 };
  }
}


class App {
  player: Spacecraft | null;
  socket: Socket;
  keyEvent?: KeyEvent;
  mouseEvent?: MouseEvent;
  state: State;
  canvas: HTMLCanvasElement;
  camera: Vec2;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  isLoaded: boolean;
  constructor() {

    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.player = null;
    this.socket = new Socket();
    this.isLoaded = false;

    this.state = {
      spacecrafts: [],
      cannonBalls: [],
    };
    this.camera = { x: 0, y: 0 };

    this.socket.emit('hello', { username: 'Player' });

    this.resize();

    this.socket.on('gameState', (state: State) => this.update(state));
    this.socket.on('createdUser', (ship: Spacecraft) => this.addPlayer(ship));

    this.image = new Image();
    this.image.onload = () => {
      this.isLoaded = true;
    }
    this.image.src = '/assets/spacecraft.png';

    window.addEventListener('resize', this.resize.bind(this));
  }

  addEvents() {
    if ( this.player ) {
      this.keyEvent = new KeyEvent(this.player.id, this.socket);
      this.mouseEvent = new MouseEvent(this.player.id, this.socket, this.canvas);
    }
  }

  resize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.mouseEvent && this.mouseEvent.setCenterPosition(this.canvas);
  }

  addPlayer(ship: Spacecraft) {
    if ( !this.player ) {
      this.player = ship;
      this.addEvents();
    }
  }

  drawUI() {
    if ( this.player ) {

      this.ctx.font = `italic 900 ${UI_FONT_NORMAL}px Roboto`;
      this.ctx.textBaseline = 'hanging';
      this.ctx.textAlign = 'start';
      const arr = [
        {
          name: 'HP',
          value: this.player.status.hp,
          max: this.player.status.hpMax,
        }, {
          name: 'FUEL',
          value: this.player.status.fuel,
          max: this.player.status.fuelMax,
        }
      ];
      for (let i=0; i<arr.length; i++) {
        const itemBaseLine = UI_BASELINE + UI_FONT_NORMAL*i + UI_GAP*i
        this.ctx.save();
        this.ctx.fillStyle = UI_FONT_COLOR;
        this.ctx.fillText(arr[i].name, UI_BASELINE, itemBaseLine + 2 );
        this.ctx.fillText(`${Math.ceil(arr[i].value)}/${arr[i].max}`, UI_BASELINE + 80 + arr[i].max, itemBaseLine + 2 );
        this.ctx.transform(1, 0, -0.5, 1, i*UI_FONT_NORMAL, 0);
        this.ctx.fillStyle = '#1e1e1e';
        this.ctx.fillRect(UI_BASELINE + 80, itemBaseLine, arr[i].max, 16);
        this.ctx.fillStyle = UI_FONT_COLOR;
        this.ctx.fillRect(UI_BASELINE + 80, itemBaseLine, arr[i].value, 16);
        this.ctx.restore();
      }
  
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = UI_FONT_COLOR;
      const dirFloor = Math.floor(this.player.dir);
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
  
      const turnPower = this.player.vel.turn < 0 ? Math.ceil(-this.player.vel.turn) : Math.ceil(this.player.vel.turn);
  
      for ( let i=0; i<turnPower; i++ ) {
        this.ctx.save();
        this.ctx.fillStyle = UI_FONT_COLOR;
        if ( this.player.vel.turn < 0 ) {
          this.ctx.transform(1, 0, 0.5, 1, -UI_FONT_NORMAL, 0);
          this.ctx.fillRect(this.canvas.width/2 - barSize/10*(i+1) - UI_GAP - 20, UI_BASELINE, barSize/10-barGap, UI_FONT_NORMAL);
        } else {
          this.ctx.transform(1, 0, -0.5, 1, UI_FONT_NORMAL, 0);
          this.ctx.fillRect(this.canvas.width/2 + barSize/10*i + UI_GAP + 20, UI_BASELINE, barSize/10-barGap, UI_FONT_NORMAL);
        }
        this.ctx.restore();
      }
  
      this.ctx.fillStyle = UI_FONT_COLOR;
      this.ctx.fillRect(this.canvas.width/2, UI_BASELINE * 3, this.player.vel.drive*10, 2);
    }
  }


  drawBackground() {
    this.ctx.fillStyle = BG_GRID_COLOR;
    for ( let i=0; i<this.canvas.width/BG_GRID_SIZE + 1; i++ ) {
      this.ctx.fillRect(-(this.camera.x % BG_GRID_SIZE) + i * BG_GRID_SIZE, 0, 1, this.canvas.height);
    }
    for ( let i=0; i<this.canvas.height/BG_GRID_SIZE + 1; i++ ) {
      this.ctx.fillRect(0, -(this.camera.y % BG_GRID_SIZE) + i * BG_GRID_SIZE, this.canvas.width, 1);
    }
  }

  update(state: State) {
    if ( this.isLoaded && this.player ) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.drawBackground();

      for ( const ship of state.spacecrafts ) {
        if ( ship.id === this.player.id ) {
          this.player = ship;
          this.camera.x = ship.pos.x - this.canvas.width / 2 + ship.size.x / 2;
          this.camera.y = ship.pos.y - this.canvas.height / 2 + ship.size.y / 2;
          this.drawUI();
        }
        const posX = ship.pos.x - this.camera.x;
        const posY = ship.pos.y - this.camera.y;
        const centerX = posX + ship.size.x / 2;
        const centerY = posY + ship.size.y / 2;

        this.ctx.font = `400 ${UI_FONT_SMALL}px Roboto`;
        this.ctx.fillStyle = UI_FONT_COLOR_GRAY;
        this.ctx.fillText(ship.username, centerX, posY -  UI_GAP);

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(ship.dir * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.drawImage(this.image, 0, 0, 96, 96, posX, posY, ship.size.x, ship.size.y);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(ship.cannon.dir * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.drawImage(this.image, 96, 0, 96, 96, ship.cannon.pos.x - this.camera.x, ship.cannon.pos.y - this.camera.y, ship.cannon.size.x, ship.cannon.size.y);
        this.ctx.restore();
      }

      for ( const cannonBall of state.cannonBalls ) {
        const x = cannonBall.pos.x - cannonBall.size.x / 2 - this.camera.x;
        const y = cannonBall.pos.y - cannonBall.size.y / 2 - this.camera.y;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, cannonBall.size.x, cannonBall.size.y);
      }
    }
  }
}


window.onload = () => {
  new App();
}

