import { getRangeAndAngleFromLocation } from "../../../utils/trigonometric";
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
    this.dir = getRangeAndAngleFromLocation(
      this.pos.x + this.size.x / 2,
      this.pos.y + this.size.y / 2,
      mouseX,
      mouseY
    ).angle;
  }

  update(shipPosX: number, shipPosY: number) {
    this.pos.x = shipPosX + this.posInShip.x;
    this.pos.y = shipPosY + this.posInShip.y;
  }
}