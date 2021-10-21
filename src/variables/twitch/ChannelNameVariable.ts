import { Variable } from '../';
import { twitch } from '../../twitch';

/**
 * Fetches the display name of a Twitch channel.
 */
export class ChannelNameVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(): Promise<string | undefined> {
    const channel = await twitch.channel(this.channelId);
    if (channel) {
      return channel.broadcaster_name;
    }
  }
}
