import Vec2 from "../Vec2";

export default class Spacecraft {
  username: string;
  pos: Vec2;
  constructor(username: string) {
    this.username = username;
    this.pos = { x: 100, y: 100 };
  }
}