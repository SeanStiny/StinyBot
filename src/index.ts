import { acnh } from './acnh';
import { app } from './app';
import { chat } from './chat';
import { config } from './config';
import { connectToDatabase } from './database';
import { logger } from './logger';
import { reloadSchedule } from './splatoon2';
import { timers } from './timers';

// Connect to the database and chat.
connectToDatabase()
  .then(() => {
    return reloadSchedule();
  })
  .then(() => {
    return acnh.loadVillagers();
  })
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
