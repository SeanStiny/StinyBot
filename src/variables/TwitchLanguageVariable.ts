import { twitch } from '../twitch';
import { Variable } from '.';

export class TwitchLanguageVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(): Promise<string | undefined> {
    const channel = await twitch.channel(this.channelId);
    if (channel) {
      return channel.broadcaster_language;
    }
  }
}
