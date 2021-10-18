import axios from 'axios';
import { config } from '../config';
import { appToken } from './app-token';

/**
 * Fetch information about a channel.
 * @param login The broadcaster's Twitch ID.
 */
export async function channel(broadcasterId: number): Promise<ChannelData> {
  const cached = channelCache[broadcasterId];
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  } else {
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
    const data = response.data.data[0];
    channelCache[broadcasterId] = { expires: Date.now() + 5000, data };
    return data;
  }
}

/**
 * Information about a channel.
 */
export interface ChannelData {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  game_name: string;
  game_id: string;
  broadcaster_language: string;
  title: string;
  delay: number;
}

// Caching
const channelCache: Record<number, ChannelCache> = {};

interface ChannelCache {
  data: ChannelData;
  expires: number;
}

function clearExpiredCache() {
  Object.keys(channelCache).forEach((key) => {
    const channelId = parseInt(key);
    const cachedChannel = channelCache[channelId];
    if (cachedChannel.expires <= Date.now()) {
      delete channelCache[channelId];
    }
  });
}

setInterval(() => {
  clearExpiredCache();
}, 10000).unref();
