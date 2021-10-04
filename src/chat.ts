import { Client } from 'tmi.js';
import { config } from './config';

/**
 * TMI chat client.
 */
export const chat = Client({
  options: {
    debug: config.logLevel === 'debug',
  },
  identity: {
    username: config.user,
    password: config.pass,
  },
});
