import { chat } from './chat';
import { chatMessage } from './listeners/chat-message';
import { join } from './listeners/join';
import { logon } from './listeners/logon';
import { logger } from './logger';

// Connect to chat
chat.connect().catch((error) => {
  logger.error(error);
});

// Listen for chat events.
chat.on('chat', chatMessage);
chat.on('logon', logon);
chat.on('join', join);
