import Vec2 from "../../Vec2";

export default class Cannon {
  size: Vec2;
  pos: Vec2;
  posInShip: Vec2;
  dir: number; 
  constructor(shipPosX: number, shipPosY: number) {
    this.size = new Vec2(96, 96);
    this.posInShip = new Vec2(0, 0);
    this.pos = new Vec2(shipPosX + this.posInShip.x, shipPosY + this.posInShip.y);
    this.dir = 0;
  }

  turn(mouseX: number, mouseY: number) {
    const a = mouseX - (this.pos.x + this.size.x / 2);
    const b = mouseY - (this.pos.y + this.size.y / 2);
    this.dir = 180 - Math.atan2(a, b) * 180 / Math.PI;
  }

  update(shipPosX: number, shipPosY: number) {
    this.pos.x = shipPosX + this.posInShip.x;
    this.pos.y = shipPosY + this.posInShip.y;


    // const a = mouseX - posX;
    // const b = mouseY - posY;
    // const range = Math.floor(Math.sqrt( a*a + b*b ));
    // const cosA = a / range;
    // this.dir = cosA * 90;

    // if ( this.dir < 0 ) {
    //   this.dir += 360;
    // }

    // if ( this.dir > 360 ) {
    //   this.dir -= 360;
    // }
  }
}