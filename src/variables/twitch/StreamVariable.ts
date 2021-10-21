import { Variable } from '../';
import { twitch } from '../../twitch';

/**
 * Fetches the status of a Twitch stream.
 */
export class StreamVariable implements Variable {
  constructor(private login: string) {}

  async fetchValue(): Promise<'live' | 'offline'> {
    const stream = (await twitch.streams([this.login]))[0];
    if (stream) {
      return 'live';
    }
    return 'offline';
  }
}
