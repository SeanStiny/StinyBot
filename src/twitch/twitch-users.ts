import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';

/**
 * Fetch information about Twitch users.
 * @param logins The login names for each user to include.
 */
export async function users(logins: string[]): Promise<UserData[]> {
  const cached = userCache[logins[0]];
  if (logins.length === 1 && cached && cached.expires > Date.now()) {
    return [cached.data];
  } else {
    const bearer = await appToken();
    const loginQueries: string[] = [];
    logins.forEach((login) => {
      loginQueries.push(`login=${login}`);
    });

    const response = await axios.get<{ data: UserData[] }>(
      `https://api.twitch.tv/helix/users?${loginQueries.join('&')}`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Client-Id': config.clientId,
        },
      }
    );

    // Cache the users.
    const now = Date.now();
    response.data.data.forEach((data) => {
      userCache[data.login] = { expires: now + 5000, data };
    });

    return response.data.data;
  }
}

/**
 * Information about a Twitch user.
 */
export interface UserData {
  broadcaster_type: string;
  description: string;
  display_name: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: string;
  view_count: number;
  email: string;
  created_at: string;
}

// Caching
const userCache: Record<string, UserCache> = {};

interface UserCache {
  data: UserData;
  expires: number;
}

function clearExpiredCache() {
  Object.keys(userCache).forEach((login) => {
    const cachedUser = userCache[login];
    if (cachedUser.expires <= Date.now()) {
      delete userCache[login];
    }
  });
}

setInterval(() => {
  clearExpiredCache();
}, 10000).unref();
