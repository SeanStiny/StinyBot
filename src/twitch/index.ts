import { channel } from './twitch-channel';
import { follow } from './twitch-follow';
import { streams } from './twitch-streams';
import { users } from './twitch-users';

/**
 * Twitch API endpoints.
 */
export const twitch = {
  channel,
  streams,
  users,
  follow,
};

export { ChannelData } from './twitch-channel';
export { StreamData } from './twitch-streams';
export { UserData } from './twitch-users';
export { FollowData } from './twitch-follow';
