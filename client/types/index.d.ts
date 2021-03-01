
declare module 'state' {

  interface Vec2 {
    x: number;
    y: number;
  }

  interface Dir2 {
    drive: number;
    turn: number;
  }

  interface Status {
    hp: number;
    hpMax: number;
    fuel: number;
    fuelMax: number;
  }

  interface Cannon {
    dir: number;
    size: Vec2;
    pos: Vec2;
  }

  interface Spacecraft {
    id: string;
    username: string;
    size: Vec2;
    pos: Vec2;
    vel: Dir2;
    dir: number;
    status: Status;
    cannon: Cannon;
  }

  interface CannonBall {
    pos: Vec2;
    size: Vec2;
  }

  export interface State {
    spacecrafts: Spacecraft[];
    cannonBalls: CannonBall[];
  }
}
