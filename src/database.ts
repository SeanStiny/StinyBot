import { Collection, MongoClient } from 'mongodb';
import { config } from './config';
import { Channel } from './models/channel';
import { Command } from './models/command';
import { Splatoon2Rotation } from './models/splatoon2-rotation';

/**
 * The database collections.
 */
export let collections: {
  channels?: Collection<Channel>;
  commands?: Collection<Command>;
  league?: Collection<Splatoon2Rotation>;
  ranked?: Collection<Splatoon2Rotation>;
  turf?: Collection<Splatoon2Rotation>;
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
    league: db.collection('league'),
    ranked: db.collection('ranked'),
    turf: db.collection('turf'),
  };

  // Create indexes
  collections.channels?.createIndex({ name: 1 }, { unique: true });
  collections.commands?.createIndex(
    { channelId: 1, trigger: 1 },
    { unique: true }
  );
  collections.league?.createIndex({ start_time: 1, end_time: -1 });
  collections.ranked?.createIndex({ start_time: 1, end_time: -1 });
  collections.turf?.createIndex({ start_time: 1, end_time: -1 });
}
