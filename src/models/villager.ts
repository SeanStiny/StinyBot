import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * Villager data loaded from acnhapi.com
 */
export interface Villager {
  _id?: ObjectId;
  id: number;
  'file-name': string;
  name: {
    'name-USen': string;
    'name-EUen': string;
    'name-EUde': string;
    'name-EUes': string;
    'name-USes': string;
    'name-EUfr': string;
    'name-USfr': string;
    'name-EUit': string;
    'name-EUnl': string;
    'name-CNzh': string;
    'name-TWzh': string;
    'name-JPja': string;
    'name-KRko': string;
    'name-EUru': string;
  };
  personality: string;
  'birthday-string': string;
  birthday: string;
  species: string;
  gender: string;
  'catch-phrase': string;
  icon_uri: string;
  image_url: string;
}

export async function insertVillagers(villagers: Villager[]): Promise<void> {
  await collections.villagers?.insertMany(villagers);
}

export async function countVillagers(): Promise<number | undefined> {
  return await collections.villagers?.countDocuments();
}

export async function findVillager(name: string): Promise<Villager | null> {
  if (!collections.villagers) {
    return null;
  }
  return await collections.villagers.findOne({
    $text: { $search: name },
  });
}
