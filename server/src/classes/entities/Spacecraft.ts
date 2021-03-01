import { getLocationFromRangeAndAngle } from "../../utils/trigonometric";
import Dir3 from "../Dir3";
import Channel from "../states/Channel";
import Vec2 from "../Vec2";
import Cannon from "./Cannon";

interface Status {
  hp: number;
  hpMax: number;
  fuel: number;
  fuelMax: number;
}

export default class Spacecraft {
  id: string;
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
  constructor(id: string, username: string) {
    this.id = id;
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
      hpMax: 120,
      fuel: 50,
      fuelMax: 80,
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
        const result = this.vel.turn + this.acc.turn;
        if ( result < 0 ) {
          this.vel.turn = result;
        } else {
          this.vel.turn = 0;
        }
      } else {
        const result = this.vel.turn + this.acc.turn;
        if ( result < this.speed.turn ) {
          this.vel.turn = result;
        } else {
          this.vel.turn = this.speed.turn;
        }
      }

    } else if ( this.moving.turn === -1 ) {
      if ( this.movingDir.turn === 1 ) {
        const result = this.vel.turn - this.acc.turn;
        if ( result > 0 ) {
          this.vel.turn = result;
        } else {
          this.vel.turn = 0;
        }
      } else {
        const result = this.vel.turn - this.acc.turn;
        if ( result > -this.speed.turn ) {
          this.vel.turn = result 
        } else {
          this.vel.turn = -this.speed.turn;
        }
      }
    }
  }

  fire(channel: Channel) {
    this.cannon.fire(channel, this.dir, this.vel.drive);
  }

  update() {

    this.accelating();
    this.turning();

    this.dir += this.vel.turn / 4;

    if ( this.dir < 0 ) {
      this.dir += 360;
    }

    if ( this.dir > 360 ) {
      this.dir -= 360;
    }

    const location = getLocationFromRangeAndAngle(this.dir, this.vel.drive);

    this.pos.x += location.x;
    this.pos.y += location.y;

    this.cannon.update(this.pos.x, this.pos.y);

    // console.log(`속도: ${Math.round(this.vel.drive)}, 선회: ${Math.round(this.vel.turn)}, 방향: ${Math.round(this.dir)}`)
  }
}