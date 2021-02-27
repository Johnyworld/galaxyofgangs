import Dir3 from "../Dir3";
import Vec2 from "../Vec2";

interface Status {
  hp: number;
  hpMax: number;
  fuel: number;
  fuelMax: number;
}

export default class Spacecraft {
  username: string;
  size: Vec2;
  pos: Vec2;
  vel: Dir3;
  acc: Dir3;
  speed: Dir3;
  moving: Dir3;
  movingDir: Dir3;
  dir: number;
  status: Status;
  constructor(username: string) {
    this.username = username;
    this.size = new Vec2(48, 48);
    this.pos = new Vec2(200, 500);
    this.vel = new Dir3(0, 0);
    this.acc =  new Dir3(0.1, 0.01);
    this.speed = new Dir3(10, 1);
    this.moving = new Dir3(0, 0);
    this.movingDir = new Dir3(0, 0);
    this.dir = 0;
    this.status = {
      hp: 100,
      hpMax: 100,
      fuel: 100,
      fuelMax: 100,
    }
  }

  accelate(press: number) {
    if ( press === 0 ) {
      if ( this.vel.drive > 0 ) this.movingDir.drive = 1;
      else if ( this.vel.drive < 0 ) this.movingDir.drive = -1;
      else this.movingDir.drive = 0;
    }
    this.moving.drive = press;
  }

  accelating() {
    if ( this.moving.drive === 1 ) {
      if ( this.movingDir.drive === -1 ) {
        if ( this.vel.drive < 0 ) {
          this.vel.drive += this.acc.drive;
        } else {
          this.vel.drive = 0;
        }
      } else {
        if ( this.vel.drive < this.speed.drive ) {
          this.vel.drive += this.acc.drive;
        } else {
          this.vel.drive = this.speed.drive;
        }
      }

    } else if ( this.moving.drive === -1 ) {
      if ( this.movingDir.drive === 1 ) {
        if ( this.vel.drive > 0 ) {
          this.vel.drive -= this.acc.drive;
        } else {
          this.vel.drive = 0;
        }
      } else {
        if ( this.vel.drive > -this.speed.drive ) {
          this.vel.drive -= this.acc.drive;
        } else {
          this.vel.drive = -this.speed.drive;
        }
      }
    } else {

    }
  }

  turn(press: number) {
    if ( press === 0 ) {
      if ( this.vel.turn > 0 ) this.movingDir.turn = 1;
      else if ( this.vel.turn < 0 ) this.movingDir.turn = -1;
      else this.movingDir.turn = 0;
    }
    this.moving.turn = press;
  }

  turning() {
    if ( this.moving.turn === 1 ) {
      if ( this.movingDir.turn === -1 ) {
        if ( this.vel.turn < 0 ) {
          this.vel.turn += this.acc.turn;
        } else {
          this.vel.turn = 0;
        }
      } else {
        if ( this.vel.turn < this.speed.turn ) {
          this.vel.turn += this.acc.turn;
        } else {
          this.vel.turn = this.speed.turn;
        }
      }

    } else if ( this.moving.turn === -1 ) {
      if ( this.movingDir.turn === 1 ) {
        if ( this.vel.turn > 0 ) {
          this.vel.turn -= this.acc.turn;
        } else {
          this.vel.turn = 0;
        }
      } else {
        if ( this.vel.turn > -this.speed.turn ) {
          this.vel.turn -= this.acc.turn;
        } else {
          this.vel.turn = -this.speed.turn;
        }
      }
    } else {

    } 
  }

  update() {

    this.accelating();
    this.turning();

    this.pos.y -= this.vel.drive;
    this.dir += this.vel.turn;

    if ( this.dir < 0 ) {
      this.dir += 360;
    }

    if ( this.dir > 360 ) {
      this.dir -= 360;
    }

    console.log(this.movingDir.drive, this.vel.drive);
  }
}