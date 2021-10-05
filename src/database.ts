import { Collection, MongoClient } from 'mongodb';
import { config } from './config';
import { Channel } from './models/channel';

/**
 * The database collections.
 */
let collections: {
  channels?: Collection<Channel>;
} = {};

/**
 * @returns The channels collection.
 */
export function channelCollection(): Collection<Channel> {
  if (collections.channels === undefined) {
    throw 'Connect to the database before calling channels()';
  }
  return collections.channels;
}

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
  };

  // Create indexes
  collections.channels?.createIndex({ name: 1 }, { unique: true });
}
