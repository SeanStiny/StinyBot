import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';

/**
 * Fetch currently live streams.
 * @param logins The login names for each streamer to find.
 */
export async function streams(logins: string[]): Promise<StreamData[]> {
  const bearer = await appToken();
  const userLoginQueries: string[] = [];
  logins.forEach((login) => {
    userLoginQueries.push(`user_login=${login}`);
  });

  const response = await axios.get<{ data: StreamData[] }>(
    `https://api.twitch.tv/helix/streams?${userLoginQueries.join('&')}`,
    {
      headers: {
        Authorization: `Bearer ${bearer}`,
        'Client-Id': config.clientId,
      },
    }
  );
  return response.data.data;
}

/**
 * Information about a currently live stream.
 */
interface StreamData {
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
