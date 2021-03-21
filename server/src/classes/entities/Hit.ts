import Vec2 from "../Vec2";

let hitId = 1;

export class Hit {
  id: number;
  pos: Vec2;
  damage: number;
  delay: number;
  frame: number;
  showing: number;
  animate: number;
  animateMax: number;

  constructor(x: number, y: number, damage: number) {
    this.id = hitId;
    hitId++;
    this.pos = new Vec2(x, y);
    this.damage = damage;
    this.delay = 150;
    this.frame = 5;
    this.showing = 0;
    this.animate = 0;
    this.animateMax = 8;
  }

  update() {
    this.pos.y -= 0.1;
    this.showing += 1;
    if ( this.animate < this.animateMax ) {
      this.animate = Math.floor(this.showing / this.frame);
    }
    console.log('===== Hit', this.animate);
  }

}