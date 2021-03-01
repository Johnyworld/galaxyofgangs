import CannonBall from "../entities/CannonBall";
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

  constructor(channels: Channel[]) {
    this.channel = channelGernerator(channels);
    this.spacecrafts = [];
    this.cannonBalls = [];
  }

  createNewCannonBall(x: number, y: number, dir: number, speed: number, power: number, distance: number, shipDir: number, shipDrive: number) {
    this.cannonBalls.push(new CannonBall(x, y, dir, speed, power, distance, shipDir, shipDrive));
  }

  removeCannonBall(id: number) {
    this.cannonBalls = this.cannonBalls.filter(ball=> ball.id !== id);
  }

  createNewSpacecraft(spacecraft: Spacecraft) {
    const isExists = this.spacecrafts.find(s=> s.username === spacecraft.username);
    if ( !isExists ) this.spacecrafts.push(spacecraft);
  }
}