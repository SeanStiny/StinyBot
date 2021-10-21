import { twitch } from '../../twitch';
import { Variable } from '../';

/**
 * Fetches the language of a Twitch channel.
 */
export class ChannelLanguageVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(): Promise<string | undefined> {
    const channel = await twitch.channel(this.channelId);
    if (channel) {
      return channel.broadcaster_language;
    }
  }
}
