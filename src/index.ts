import { acnh } from './acnh';
import { chat } from './chat';
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
  })
  .catch((error) => {
    logger.error(error);
  });
