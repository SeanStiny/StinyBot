import ISO6391 from 'iso-639-1';
import { Variable } from '../';
import { twitch } from '../../twitch';

/**
 * Fetches the language a Twitch user has set their channel to.
 */
export class UserLanguageVariable implements Variable {
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
        let language = channel.broadcaster_language;
        if (language != 'other') {
          language = ISO6391.getName(language);
        }
        return language;
      }
    }
  }
}
