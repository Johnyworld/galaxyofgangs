import { getRangeAndAngleFromLocation } from "../../utils/trigonometric";
import Channel from "../states/Channel";
import Vec2 from "../Vec2";


export default class Cannon {
  size: Vec2;
  pos: Vec2;
  posInShip: Vec2;
  dir: number; 
  power: number;
  accuracy: number;
  delay: number;
  firing: boolean;
  constructor(shipPosX: number, shipPosY: number) {
    this.size = new Vec2(96, 96);
    this.posInShip = new Vec2(0, 0);
    this.pos = new Vec2(shipPosX + this.posInShip.x, shipPosY + this.posInShip.y);
    this.dir = 0;
    this.power = 5;
    this.accuracy = 10;
    this.delay = 800;
    this.firing = false;
  }

  turn(mouseX: number, mouseY: number, centerX: number, centerY: number) {
    this.dir = getRangeAndAngleFromLocation( centerX, centerY, mouseX, mouseY).angle;
  }

  fire(channel: Channel, shipId: string, shipDir: number, shipDrive: number) {
    if ( !this.firing ) {
      this.firing = true;
      const centerX = this.pos.x + this.size.x / 2;
      const centerY = this.pos.y + this.size.y / 2;
      const spread = Math.random() * this.accuracy - this.accuracy / 2
      const power = Math.round(Math.random() * this.power) + this.power;
      channel.createNewCannonBall(centerX, centerY, this.dir + spread, 8, power, 80, shipId, shipDir, shipDrive);
      setTimeout(() => {
        this.firing = false;
      }, this.delay)
    }
  }

  update(shipPosX: number, shipPosY: number) {
    this.pos.x = shipPosX + this.posInShip.x;
    this.pos.y = shipPosY + this.posInShip.y;
  }
}