import Spacecraft from "../entities/Spacecraft";

const channelGernerator: (channels: Channel[]) => number = (channels) => {
  const newChannel = Math.floor(Math.random() * 10000);
  const isExists = channels.find(ch => ch.channel === newChannel);
  if (isExists) return channelGernerator(channels);
  else return newChannel;
}

export default class Channel {
  channel: number;
  spacecrafts: Spacecraft[];

  constructor(channels: Channel[]) {
    this.channel = channelGernerator(channels);
    this.spacecrafts = [];
  }

  createNewSpacecraft(spacecraft: Spacecraft) {
    this.spacecrafts.push(spacecraft);
  }
}