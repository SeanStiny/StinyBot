import { DateTime } from 'luxon';
import { Variable } from '..';
import { twitch } from '../../twitch';
import { durationString } from '../../utils/duration-string';

export class UserFollowAgeVariable implements Variable {
  constructor(private fromId: number, private toId: number) {}

  async fetchValue(): Promise<string> {
    const follow = await twitch.follow(this.fromId, this.toId);

    if (follow) {
      const followedAt = DateTime.fromISO(follow.followed_at);
      return durationString(followedAt, DateTime.now());
    }
    return '';
  }
}
