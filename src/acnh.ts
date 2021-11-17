import villagerData from './models/villagers.json';

const villagers: Record<string, Villager> = {};

// Load the villager data.
villagerData.forEach((entry) => {
  const villager = {
    nameUS: entry.name['name-USen'],
    nameEU: entry.name['name-EUen'],
    gender: entry.gender,
    personality: entry.personality,
    catchphrase: entry['catch-phrase'],
    birthday: entry['birthday-string'],
  };

  villagers[villager.nameUS.toLowerCase()] = villager;
  if (villager.nameUS !== villager.nameEU) {
    villagers[villager.nameEU.toLowerCase()] = villager;
  }
});

/**
 * Animal Crossing: New Horizons module.
 */
export const acnh = {
  villagers,
};

/**
 * ACNH villager
 */
interface Villager {
  nameUS: string;
  nameEU: string;
  gender: string;
  personality: string;
  catchphrase: string;
  birthday: string;
}
