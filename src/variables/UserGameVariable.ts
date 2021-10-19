import { Variable } from '.';
import { twitch } from '../twitch';

export class UserGameVariable implements Variable {
  constructor(private login: string) {
    if (login.charAt(0) === '@') {
      this.login = login.substring(1);
    }
  }

  async fetchValue(): Promise<string | undefined> {
    const user = (await twitch.users([this.login]))[0];
    if (user) {
      const channel = await twitch.channel(parseInt(user.id));
      if (channel) {
        return channel.game_name;
      }
    }
  }
}
