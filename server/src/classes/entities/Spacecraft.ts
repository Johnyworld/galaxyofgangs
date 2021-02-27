import { timeStamp } from "console";
import Dir3 from "../Dir3";
import Vec2 from "../Vec2";
import Cannon from "./patials/Cannon";

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
  cannon: Cannon;
  constructor(username: string) {
    this.username = username;
    this.size = new Vec2(96, 96);
    this.pos = new Vec2(200, 500);
    this.vel = new Dir3(0, 0);
    this.acc =  new Dir3(0.1, 0.1);
    this.speed = new Dir3(10, 10);
    this.moving = new Dir3(0, 0);
    this.movingDir = new Dir3(0, 0);
    this.dir = 0;
    this.cannon = new Cannon(this.pos.x, this.pos.y);
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
    }
  }

  update() {

    this.accelating();
    this.turning();

    this.dir += this.vel.turn / 8;

    if ( this.dir < 0 ) {
      this.dir += 360;
    }

    if ( this.dir > 360 ) {
      this.dir -= 360;
    }

    const degPi = this.dir * (Math.PI / 180);
    const b = (this.vel.drive / 2) * Math.cos(degPi);
    const c = (this.vel.drive / 2) * Math.sin(degPi);

    this.pos.y -= b;
    this.pos.x += c;

    this.cannon.update(this.pos.x, this.pos.y);

    // console.log(`속도: ${Math.round(this.vel.drive)}, 선회: ${Math.round(this.vel.turn)}, 방향: ${Math.round(this.dir)}`)
  }
}