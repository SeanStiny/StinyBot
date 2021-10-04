import { config } from '../config';
import { logger } from '../logger';

/**
 * Listen for a chat logon event.
 */
export function logon(): void {
  logger.info(`Logged into chat as '${config.user}'`);
}
