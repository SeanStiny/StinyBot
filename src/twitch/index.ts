import { channel } from './twitch-channel';
import { streams } from './twitch-streams';
import { users } from './twitch-users';

/**
 * Twitch API endpoints.
 */
export const twitch = {
  channel,
  streams,
  users,
};

export { ChannelData } from './twitch-channel';
export { StreamData } from './twitch-streams';
export { UserData } from './twitch-users';
