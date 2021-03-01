import { getLocationFromRangeAndAngle } from "../../utils/trigonometric";
import Vec2 from "../Vec2";

let cannonBallId = 1;

export default class CannonBall {
  id: number;
  pos: Vec2;
  size: Vec2;
  dir: number;
  speed: number;
  power: number;
  distance: number;
  shipDir: number;
  shipDrive: number;
  constructor( x: number, y: number, dir: number, speed: number, power: number, distance: number, shipDir: number, shipDrive: number) {
    this.id = cannonBallId;
    cannonBallId++;
    this.pos = new Vec2(x, y);
    this.size = new Vec2(4, 4);
    this.dir = dir;
    this.speed = speed;
    this.power = power;
    this.distance = distance;
    this.shipDir = shipDir;
    this.shipDrive = shipDrive;
  }

  update() {
    if ( this.distance > 0 ) {
      this.distance -= 1;

      const shipLocation = getLocationFromRangeAndAngle(this.shipDir, this.shipDrive);
      const location = getLocationFromRangeAndAngle(this.dir, this.speed);
  
      this.pos.x += location.x + shipLocation.x;
      this.pos.y += location.y + shipLocation.y;
    }
  }
}