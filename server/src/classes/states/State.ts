import Channel from "./Channel";

export default class State {
  channels: Channel[];

  constructor() {
    this.channels = [];
  }

  createNewChannel() {
    this.channels.push(new Channel(this.channels));
  }
}