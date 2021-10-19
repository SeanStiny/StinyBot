import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';
import { isValidLogin } from './validate-login';

/**
 * Fetch currently live streams.
 * @param logins The login names for each streamer to find.
 */
export async function streams(logins: string[]): Promise<StreamData[]> {
  const cached = streamCache[logins[0]];
  if (logins.length === 1 && cached && cached.expires > Date.now()) {
    return [cached.data];
  } else {
    const bearer = await appToken();
    const userLoginQueries: string[] = [];
    logins.forEach((login) => {
      if (isValidLogin(login)) {
        userLoginQueries.push(`user_login=${login.toLowerCase()}`);
      }
    });

    if (userLoginQueries.length > 0) {
      const response = await axios.get<{ data: StreamData[] }>(
        `https://api.twitch.tv/helix/streams?${userLoginQueries.join('&')}`,
        {
          headers: {
            Authorization: `Bearer ${bearer}`,
            'Client-Id': config.clientId,
          },
        }
      );

      // Cache the streams.
      const now = Date.now();
      response.data.data.forEach((data) => {
        streamCache[data.user_login] = { expires: now + 5000, data };
      });

      return response.data.data;
    } else {
      return [];
    }
  }
}

/**
 * Information about a currently live stream.
 */
export interface StreamData {
  id: number;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live' | '';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

// Caching
const streamCache: Record<string, StreamCache> = {};

interface StreamCache {
  data: StreamData;
  expires: number;
}

function clearExpiredCache() {
  Object.keys(streamCache).forEach((login) => {
    const cachedStream = streamCache[login];
    if (cachedStream.expires <= Date.now()) {
      delete streamCache[login];
    }
  });
}

setInterval(() => {
  clearExpiredCache();
}, 10000).unref();
