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

  constructor(channels: Channel[]) {
    this.channel = channelGernerator(channels);
    this.spacecrafts = [];
  }

  createNewSpacecraft(spacecraft: Spacecraft) {
    const isExists = this.spacecrafts.find(s=> s.username === spacecraft.username);
    if ( !isExists ) this.spacecrafts.push(spacecraft);
  }
}