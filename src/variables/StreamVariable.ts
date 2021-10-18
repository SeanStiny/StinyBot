import { Variable } from '.';
import { twitch } from '../twitch';

export class StreamVariable implements Variable {
  constructor(private login: string) {}

  async fetchValue(): Promise<string> {
    const stream = (await twitch.streams([this.login]))[0];
    if (stream) {
      return 'live';
    }
    return 'offline';
  }
}
