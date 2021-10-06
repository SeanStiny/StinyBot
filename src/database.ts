import { Collection, MongoClient } from 'mongodb';
import { config } from './config';
import { Channel } from './models/channel';
import { Command } from './models/command';

/**
 * The database collections.
 */
export let collections: {
  channels?: Collection<Channel>;
  commands?: Collection<Command>;
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
  };

  // Create indexes
  collections.channels?.createIndex({ name: 1 }, { unique: true });
  collections.commands?.createIndex(
    { channelId: 1, trigger: 1 },
    { unique: true }
  );
}
