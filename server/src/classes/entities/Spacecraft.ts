import Vec2 from "../Vec2";

interface Status {
  hp: number;
  hpMax: number;
  fuel: number;
  fuelMax: number;
}

export default class Spacecraft {
  username: string;
  pos: Vec2;
  vel: Vec2;
  status: Status;
  constructor(username: string) {
    this.username = username;
    this.pos = { x: 100, y: 100 };
    this.vel = { x: 1, y: 1 };
    this.status = {
      hp: 100,
      hpMax: 100,
      fuel: 100,
      fuelMax: 100,
    }
  }

  accelate(x: number, y: number) {
    this.vel.x += x;
    this.vel.y += y;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}