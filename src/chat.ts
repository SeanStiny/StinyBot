import { Client } from 'tmi.js';
import { config } from './config';

/**
 * TMI chat client.
 */
export const chat = Client({
  identity: { username: config.user, password: config.pass },
});
