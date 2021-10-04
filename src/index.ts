import { chat } from './chat';
import { connectToDatabase } from './database';
import { logger } from './logger';

// Connect to the database and chat.
connectToDatabase()
  .then(() => {
    return chat.connect();
  })
  .catch((error) => {
    logger.error(error);
  });
