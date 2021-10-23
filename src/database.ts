import { Collection, MongoClient } from 'mongodb';
import { config } from './config';
import { Channel } from './models/channel';
import { Command } from './models/command';
import { DictionaryEntry } from './models/dictionary';
import { Splatoon2Rotation } from './models/splatoon2-rotation';
import { Splatoon2Shift } from './models/splatoon2-salmon';
import { Timer } from './models/timer';
import { Villager } from './models/villager';

/**
 * The database collections.
 */
export let collections: {
  channels?: Collection<Channel>;
  commands?: Collection<Command>;
  timers?: Collection<Timer>;
  dictionary?: Collection<DictionaryEntry>;

  league?: Collection<Splatoon2Rotation>;
  ranked?: Collection<Splatoon2Rotation>;
  turf?: Collection<Splatoon2Rotation>;
  salmon?: Collection<Splatoon2Shift>;

  villagers?: Collection<Villager>;
} = {};

// Set up the database client.
const client = new MongoClient(config.dbUri);

/**
 * Connect to the database.
 */
export async function connectToDatabase(): Promise<void> {
  await client.connect();
  const db = client.db(config.dbName);

  collections = {
    channels: db.collection('channels'),
    commands: db.collection('commands'),
    timers: db.collection('timers'),
    dictionary: db.collection('dictionary'),

    league: db.collection('league'),
    ranked: db.collection('ranked'),
    turf: db.collection('turf'),
    salmon: db.collection('salmon'),

    villagers: db.collection('villagers'),
  };

  // Create indexes
  collections.channels?.createIndex({ name: 1 }, { unique: true });
  collections.channels?.createIndex({ lastActive: 1 }, { sparse: true });
  collections.commands?.createIndex(
    { channelId: 1, trigger: 1 },
    { unique: true }
  );
  collections.timers?.createIndex({ channelId: 1, alias: 1 }, { unique: true });
  collections.dictionary?.createIndex(
    { channelId: 1, key: 1 },
    { unique: true }
  );

  collections.league?.createIndex({ start_time: 1 }, { unique: true });
  collections.ranked?.createIndex({ start_time: 1 }, { unique: true });
  collections.turf?.createIndex({ start_time: 1 }, { unique: true });
  collections.league?.createIndex({ end_time: -1 });
  collections.ranked?.createIndex({ end_time: -1 });
  collections.turf?.createIndex({ end_time: -1 });
  collections.salmon?.createIndex({ end_time: 1 }, { unique: true });

  collections.villagers?.createIndex(
    { 'name.name-USen': 'text', 'name.name-EUen': 'text' },
    { unique: true }
  );
}
