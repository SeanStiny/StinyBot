import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';

/**
 * Fetch information about a Twitch follow.
 * @param login The broadcaster's Twitch ID.
 */
export async function follow(
  fromId: number,
  toId: number
): Promise<FollowData> {
  const cached = followCache[`${fromId}-${toId}`];
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  } else {
    const bearer = await appToken();

    const response = await axios.get<{ data: FollowData[] }>(
      `https://api.twitch.tv/helix/users/follows?from_id=${fromId}&to_id=${toId}`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Client-Id': config.clientId,
        },
      }
    );
    const data = response.data.data[0];
    followCache[`${fromId}-${toId}`] = { expires: Date.now() + 5000, data };
    return data;
  }
}

/**
 * Information about a follow.
 */
export interface FollowData {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_login: string;
  to_name: string;
  followed_at: string;
}

// Caching
const followCache: Record<string, FollowCache> = {};

interface FollowCache {
  data: FollowData;
  expires: number;
}

function clearExpiredCache() {
  Object.keys(followCache).forEach((key) => {
    const cachedFollow = followCache[key];
    if (cachedFollow.expires <= Date.now()) {
      delete followCache[key];
    }
  });
}

setInterval(() => {
  clearExpiredCache();
}, 10000).unref();
