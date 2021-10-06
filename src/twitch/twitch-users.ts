import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';

/**
 * Fetch information about Twitch users.
 * @param logins The login names for each user to include.
 */
export async function users(logins: string[]): Promise<UserData[]> {
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
  return response.data.data;
}

/**
 * Information about a Twitch user.
 */
interface UserData {
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
