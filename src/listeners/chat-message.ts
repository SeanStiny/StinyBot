import { ChatUserstate } from 'tmi.js';
import { logger } from '../logger';

/**
 * Listen for a chat message event.
 */
export function chatMessage(
  channel: string,
  userstate: ChatUserstate,
  message: string,
  self: boolean
): void {
  if (self) {
    return;
  }

  logger.info(`${channel} [${userstate['display-name']}]: ${message}`);
}
