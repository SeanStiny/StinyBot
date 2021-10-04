import { chat } from './chat';
import { chatMessage } from './listeners/chat-message';
import { chatJoin } from './listeners/chat-join';
import { chatConnected } from './listeners/chat-connected';
import { logger } from './logger';

// Connect to chat
chat.connect().catch((error) => {
  logger.error(error);
});

// Listen for chat events.
chat.on('chat', chatMessage);
chat.on('connected', chatConnected);
chat.on('join', chatJoin);
