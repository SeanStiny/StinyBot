import { Client } from 'tmi.js';
import { config } from './config';
import { logger } from './logger';

const chat = Client({
  channels: config.channels,
  options: { joinInterval: 300 },
  identity: { username: config.user, password: config.pass },
});
chat.connect();

/**
 * Chat message event
 */
chat.on('chat', (channel, userstate, message, self) => {
  if (self) {
    return;
  }

  logger.info(`${channel} [${userstate['display-name']}]: ${message}`);
});

/**
 * Chat logon event
 */
chat.on('logon', () => {
  logger.info(`Logged into chat as '${config.user}'`);
});

/**
 * Chat join event
 */
chat.on('join', (channel, username, self) => {
  if (self) {
    logger.info(`Joined channel ${channel}`);
  }
});
