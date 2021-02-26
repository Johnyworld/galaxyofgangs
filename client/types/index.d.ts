
declare module 'state' {

  interface Vec2 {
    x: number;
    y: number;
  }

  interface Status {
    hp: number;
    hpMax: number;
    fuel: number;
    fuelMax: number;
  }

  interface Spacecraft {
    username: string;
    size: Vec2;
    pos: Vec2;
    vel: Vec2;
    dir: number;
    status: Status;
  }

  export interface State {
    spacecrafts: Spacecraft[];
  }
}
