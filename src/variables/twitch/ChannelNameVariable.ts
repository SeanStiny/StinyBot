import { Variable } from '.';
import { twitch } from '../twitch';

export class ChannelNameVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(): Promise<string | undefined> {
    const channel = await twitch.channel(this.channelId);
    if (channel) {
      return channel.broadcaster_name;
    }
  }
}
