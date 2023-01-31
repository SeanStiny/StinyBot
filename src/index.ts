import { app } from './app';
import { chat } from './chat';
import { config } from './config';
import { connectToDatabase } from './database';
import { logger } from './logger';
import { timers } from './timers';

// Connect to the database and chat.
connectToDatabase()
  .then(() => {
    return chat.connect();
  })
  .then(() => {
    timers.scheduleTick();
    app.listen(config.port);
    logger.info(`Listening on port ${config.port}`);
  })
  .catch((error) => {
    logger.error(error);
  });
