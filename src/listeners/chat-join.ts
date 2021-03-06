import { logger } from '../logger';

/**
 * Listen for a chat join event.
 */
export function chatJoin(
  channel: string,
  username: string,
  self: boolean
): void {
  if (self) {
    logger.info(`Joined channel ${channel}.`);
  }
}
