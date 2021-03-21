import { Spacecraft, State, Vec2 } from 'state';
import { coverSizing } from './utils.js';


const UI_BASELINE = 20;
const UI_GAP = 16;
const UI_FONT_NORMAL = 16;
const UI_FONT_SMALL = 13;
const UI_FONT_COLOR = '#0090ff';
const UI_FONT_COLOR_GRAY = '#888';
const BG_GRID_SIZE = 200;
const BG_GRID_COLOR = '#222';
const BG_LAYER_1 = 1;
const BG_LAYER_2 = 2;
const BG_LAYER_3 = 10;


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
  images: {
    background: HTMLImageElement;
    spacecrafts: HTMLImageElement;
    boomSprites: HTMLImageElement;
  } | null;
  constructor() {

    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.player = null;
    this.images = null;
    this.socket = new Socket();

    this.state = {
      spacecrafts: [],
      cannonBalls: [],
      hits: [],
    };

    this.camera = { x: 0, y: 0 };

    this.socket.emit('hello', { username: 'Player' });

    this.resize();
    this.loadImages();

    this.socket.on('gameState', (state: State) => this.update(state));
    this.socket.on('createdUser', (ship: Spacecraft) => this.addPlayer(ship));

    window.addEventListener('resize', this.resize.bind(this));
  }

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      }
      image.src = url;
    }) 
  }

  loadImages() {
    Promise.all([
      this.loadImage('/assets/spacecraft.png'),
      this.loadImage('/assets/bg01.png'),
      this.loadImage('/assets/boomsprite.png'),
    ]).then(([ spacecrafts, background, boomSprites ]) => {
      this.images = {
        spacecrafts,
        background,
        boomSprites,
      }
    })
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

      this.ctx.fillStyle = UI_FONT_COLOR;
      this.ctx.textAlign = 'end';
      this.ctx.fillText(`${this.player.pos.x.toFixed(3)}, ${this.player.pos.y.toFixed(3)}`, this.canvas.width - UI_BASELINE, UI_BASELINE);

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


  drawBackgroundImage(image: HTMLImageElement, layerLevel: number, player: Spacecraft) {
    const newImage = coverSizing(this.canvas.width, this.canvas.height, image.width, image.height);

    // 배경이 몇번 반복되는지 값 (0 -> 1 -> 2 -> 3 ...)
    const xx = -(Math.floor((newImage.x - player.pos.x / layerLevel) / newImage.width) + 1); 
    const yy = -(Math.floor((newImage.y - player.pos.y / layerLevel) / newImage.height) + 1);

    // 음수 보정
    const xxx = xx < 0 ? xx+1 : xx;
    const yyy = yy < 0 ? yy+1 : yy;
    const secondSignX = xx < 0 ? -1 : 1;
    const secondSignY = yy < 0 ? -1 : 1;

    // 배경 그림의 베이스 위치
    const baseX = newImage.x - player.pos.x / layerLevel;
    const baseY = newImage.y - player.pos.y / layerLevel;

    // 베이스 + 반복 값 - 1칸씩 이동할 때 마다 새로운 배경을 미리 갱신
    const x1 = baseX + newImage.width * (xxx + xxx%2);
    const y1 = baseY + newImage.height * (yyy + yyy%2);
    const x2 = baseX + newImage.width * (xxx - xxx%2 + secondSignX);
    const y2 = baseY + newImage.height * (yyy - yyy%2 + secondSignY);

    this.ctx.drawImage(
      image,
      0, 0, image.width, image.height,
      x2, y1, newImage.width, newImage.height,
    );
    this.ctx.drawImage(
      image,
      0, 0, image.width, image.height,
      x1, y2, newImage.width, newImage.height,
    );
    this.ctx.drawImage(
      image,
      0, 0, image.width, image.height,
      x2, y2, newImage.width, newImage.height,
    );
    this.ctx.drawImage(
      image,
      0, 0, image.width, image.height,
      x1, y1, newImage.width, newImage.height,
    );
    
  }


  drawBackground() {
    // this.ctx.fillStyle = BG_GRID_COLOR;
    // for ( let i=0; i<this.canvas.width/BG_GRID_SIZE + 1; i++ ) {
    //   this.ctx.fillRect(-(this.camera.x % BG_GRID_SIZE) + i * BG_GRID_SIZE, 0, 1, this.canvas.height);
    // }
    // for ( let i=0; i<this.canvas.height/BG_GRID_SIZE + 1; i++ ) {
    //   this.ctx.fillRect(0, -(this.camera.y % BG_GRID_SIZE) + i * BG_GRID_SIZE, this.canvas.width, 1);
    // }

    if ( this.images && this.player ) {
      this.drawBackgroundImage(this.images.background, BG_LAYER_1, this.player);
      this.drawBackgroundImage(this.images.background, BG_LAYER_2, this.player);
      this.drawBackgroundImage(this.images.background, BG_LAYER_3, this.player);
    }
    
  }

  update(state: State) {
    if ( this.images && this.player ) {
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
        this.ctx.drawImage(this.images.spacecrafts, 0, 0, 96, 96, posX, posY, ship.size.x, ship.size.y);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(ship.cannon.dir * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.drawImage(this.images.spacecrafts, 96, 0, 96, 96, ship.cannon.pos.x - this.camera.x, ship.cannon.pos.y - this.camera.y, ship.cannon.size.x, ship.cannon.size.y);
        this.ctx.restore();
      }

      for ( const cannonBall of state.cannonBalls ) {
        const x = cannonBall.pos.x - cannonBall.size.x / 2 - this.camera.x;
        const y = cannonBall.pos.y - cannonBall.size.y / 2 - this.camera.y;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, cannonBall.size.x, cannonBall.size.y);
      }

      for ( const hit of state.hits ) {
        const x = hit.pos.x - this.camera.x;
        const y = hit.pos.y - this.camera.y;
        this.ctx.fillStyle = '#ff4411';
        this.ctx.font = `400 ${UI_FONT_NORMAL}px Roboto`;
        if ( hit.animate < hit.animateMax ) {
          this.ctx.drawImage(this.images.boomSprites, 40*hit.animate, 0, 40, 40, x - 20, y - 20, 40, 40);
        } else {
          this.ctx.fillText(hit.damage.toString(), x, y);
        }
      }
    }
  }
}


window.onload = () => {
  new App();
}

