import { twitch } from '../../twitch';
import { Variable } from '..';

/**
 * Fetches the game a twitch channel is playing.
 */
export class ChannelGameVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(): Promise<string | undefined> {
    const channel = await twitch.channel(this.channelId);
    if (channel) {
      return channel.game_name;
    }
  }
}
