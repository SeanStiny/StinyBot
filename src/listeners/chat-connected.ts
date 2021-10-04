import { config } from '../config';
import { logger } from '../logger';

/**
 * Listen for a chat connected event.
 */
export async function chatConnected(): Promise<void> {
  logger.info(`Logged into chat as '${config.user}'`);
}
