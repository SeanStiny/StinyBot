import { Client } from 'tmi.js';
import { config } from './config';
import { chatConnected } from './listeners/chat-connected';
import { chatJoin } from './listeners/chat-join';
import { chatMessage } from './listeners/chat-message';
import { chatPart } from './listeners/chat-part';

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

// Listen for chat events.
chat.on('chat', chatMessage);
chat.on('connected', chatConnected);
chat.on('join', chatJoin);
chat.on('part', chatPart);
