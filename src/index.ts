import { chat } from './chat';
import { connectToDatabase } from './database';
import { chatMessage } from './listeners/chat-message';
import { chatJoin } from './listeners/chat-join';
import { chatConnected } from './listeners/chat-connected';
import { logger } from './logger';

// Connect to the database and chat.
connectToDatabase()
  .then(() => {
    return chat.connect();
  })
  .catch((error) => {
    logger.error(error);
  });

// Listen for chat events.
chat.on('chat', chatMessage);
chat.on('connected', chatConnected);
chat.on('join', chatJoin);
