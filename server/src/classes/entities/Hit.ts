import Vec2 from "../Vec2";

let hitId = 1;

export class Hit {
  id: number;
  pos: Vec2;
  damage: number;
  show: boolean;
  constructor(x: number, y: number, damage: number) {
    this.id = hitId;
    hitId++;
    this.pos = new Vec2(x, y);
    this.damage = damage;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 2000);
  }
  update() {
    this.pos.y -= 0.1;
  }
}