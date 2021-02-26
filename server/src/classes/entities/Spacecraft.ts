import Dir3 from "../Dir3";
import Vec2 from "../Vec2";

interface Status {
  hp: number;
  hpMax: number;
  fuel: number;
  fuelMax: number;
}

interface Speed {
  drive: number;
  turn: number;
}

export default class Spacecraft {
  username: string;
  pos: Vec2;
  vel: Dir3;
  acc: Dir3;
  moving: Dir3;
  status: Status;
  speed: Speed;
  constructor(username: string) {
    this.username = username;
    this.pos = { x: 200, y: 500 };
    this.vel = { left: 0, right: 0, drive: 0 };
    this.acc = { left: 0, right: 0, drive: 0.1 };
    this.moving = { left: 0, right: 0, drive: 0 }
    this.speed = {
      drive: 10,
      turn: 10,
    }
    this.status = {
      hp: 100,
      hpMax: 100,
      fuel: 100,
      fuelMax: 100,
    }
  }

  accelate(press: number) {
    this.moving.drive = press;
  }

  turn() {

  }

  update() {

    if ( this.moving.drive === 1 ) {
      if ( this.vel.drive < this.speed.drive ) {
        this.vel.drive += this.acc.drive;
      } else {
        this.vel.drive = this.speed.drive;
      }
    } else if ( this.moving.drive === -1 ) {
      if ( this.vel.drive > 0 ) {
        this.vel.drive -= this.acc.drive;
      } else {
        this.vel.drive = 0;
      }
    } else {

    }

    this.pos.y -= this.vel.drive;

    console.log(this.vel.drive);
  }
}