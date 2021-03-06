import CannonBall from "../entities/CannonBall";
import { Hit } from "../entities/Hit";
import Spacecraft from "../entities/Spacecraft";

const channelGernerator: (channels: Channel[]) => string = (channels) => {
  const newChannel = Math.floor(Math.random() * 10000).toString();
  const isExists = channels.find(ch => ch.channel === newChannel);
  if (isExists) return channelGernerator(channels);
  else return newChannel;
}

export default class Channel {
  channel: string;
  spacecrafts: Spacecraft[];
  cannonBalls: CannonBall[];
  hits: Hit[];

  constructor(channels: Channel[]) {
    this.channel = channelGernerator(channels);
    this.spacecrafts = [];
    this.cannonBalls = [];
    this.hits = [];
  }

  createNewCannonBall(x: number, y: number, dir: number, speed: number, power: number, distance: number, shipId: string, shipDir: number, shipDrive: number) {
    this.cannonBalls.push(new CannonBall(x, y, dir, speed, power, distance, shipId, shipDir, shipDrive));
  }

  removeCannonBall(id: number) {
    this.cannonBalls = this.cannonBalls.filter(ball => ball.id !== id);
  }

  createNewSpacecraft(spacecraft: Spacecraft) {
    const isExists = this.spacecrafts.find(s=> s.id === spacecraft.id);
    if ( !isExists ) this.spacecrafts.push(spacecraft);
  }

  removeSpacecraft(id: string) {
    this.spacecrafts = this.spacecrafts.filter(ship => ship.id !== id);
  }

  createHits(x: number, y: number, damage: number) {
    this.hits.push(new Hit(x, y, damage));
  }

  removeHits(id: number) {
    this.hits = this.hits.filter(h=> h.id !== id);
  }
}