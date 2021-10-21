import { DateTime } from 'luxon';
import { Variable } from '..';
import { twitch } from '../../twitch';
import { durationString } from '../../utils/duration-string';

export class TargetFollowAgeVariable implements Variable {
  constructor(private fromLogin: string, private toId: number) {}

  async fetchValue(): Promise<string> {
    const user = (await twitch.users([this.fromLogin]))[0];

    if (user) {
      const follow = await twitch.follow(parseInt(user.id), this.toId);

      if (follow) {
        const followedAt = DateTime.fromISO(follow.followed_at);
        return durationString(followedAt, DateTime.now());
      }
    }
    return '';
  }
}
