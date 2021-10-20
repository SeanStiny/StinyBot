import { Variable } from '../';
import { twitch } from '../../twitch';

export class UserNameVariable implements Variable {
  constructor(private login: string) {
    if (login.charAt(0) === '@') {
      this.login = login.substring(1);
    }
  }

  async fetchValue(): Promise<string | undefined> {
    const user = (await twitch.users([this.login]))[0];
    if (user) {
      return user.display_name;
    }
  }
}
