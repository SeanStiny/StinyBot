import axios from 'axios';
import { logger } from './logger';
import { countVillagers, insertVillagers, Villager } from './models/villager';

/**
 * Animal Crossing: New Horizons module.
 */
export const acnh = {
  loadVillagers,
};

/**
 * Load the ACNH villagers from acnhapi.com if they are not already loaded.
 */
async function loadVillagers(): Promise<void> {
  const count = await countVillagers();
  if (count === 0) {
    const response = await axios.get<Villager[]>(
      'https://acnhapi.com/v1a/villagers/'
    );
    const villagers = response.data;

    await insertVillagers(villagers);
    logger.info(`Loaded ACNH info for ${villagers.length} villagers.`);
  } else {
    logger.info('ACNH villagers already loaded.');
  }
}
