import { Variable } from '..';
import { twitch } from '../../twitch';

export class StreamUptimeVariable implements Variable {
  constructor(private login: string) {}

  async fetchValue(): Promise<string | undefined> {
    const stream = (await twitch.streams([this.login]))[0];
    if (stream) {
      const totalMs = Date.now() - new Date(stream.started_at).getTime();
      const totalMinutes = Math.floor(totalMs / 1000 / 60);
      const totalHours = Math.floor(totalMinutes / 60);

      const hours = totalHours;
      const minutes = totalMinutes % 60;

      let uptime = '';
      if (hours > 0) {
        uptime += `${hours} hours, `;
      }
      uptime += `${minutes} minutes`;

      return uptime;
    }
  }
}
