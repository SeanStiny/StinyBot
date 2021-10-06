import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';

/**
 * Fetch information about a channel.
 * @param login The broadcaster's Twitch ID.
 */
export async function channel(broadcasterId: number): Promise<ChannelData[]> {
  const bearer = await appToken();

  const response = await axios.get<{ data: ChannelData[] }>(
    `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
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
 * Information about a channel.
 */
interface ChannelData {
  broadcaster_id: string;
  broadcaster_name: string;
  game_name: string;
  game_id: string;
  broadcaster_language: string;
  title: string;
  delay: number;
}
