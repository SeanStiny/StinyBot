import { logger } from '../logger';

/**
 * Listen for a chat part event.
 */
export function chatPart(
  channel: string,
  username: string,
  self: boolean
): void {
  if (self) {
    logger.info(`Left channel ${channel}.`);
  }
}
