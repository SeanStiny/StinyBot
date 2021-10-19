import { chat } from './chat';
import { connectToDatabase } from './database';
import { logger } from './logger';
import { reloadSchedule } from './splatoon2';

// Connect to the database and chat.
connectToDatabase()
  .then(() => {
    return reloadSchedule();
  })
  .then(() => {
    return chat.connect();
  })
  .catch((error) => {
    logger.error(error);
  });
