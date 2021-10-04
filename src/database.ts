import { Collection, MongoClient } from 'mongodb';
import { config } from './config';

/**
 * The database collections.
 */
export let collections: { channels?: Collection } = {};

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
