import { chat } from '../chat';
import { config } from '../config';
import { logger } from '../logger';
import { allChannels } from '../models/channel';

/**
 * Listen for a chat connected event.
 */
export async function chatConnected(): Promise<void> {
  logger.info(`Logged into chat as '${config.user}'`);

  // Join the bot's chat.
  chat.join(`#${config.user.toLowerCase()}`);

  // Join user's chats.
  (await allChannels()).forEach((channel) => {
    chat.join(channel.name).catch((reason) => {
      logger.warn(`Failed to join ${channel.name}: ${reason}`);
    });
  });
}
