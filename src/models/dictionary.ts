import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * A key-value pair belonging to a channel.
 */
export class DictionaryEntry {
  id?: ObjectId;

  constructor(
    public channelId: number,
    public key: string,
    public value: string
  ) {
    this.key = key.toLowerCase();
  }
}

export async function insertDictionaryEntry(
  entry: DictionaryEntry
): Promise<void> {
  await collections.dictionary?.insertOne(entry);
}

export async function findDictionaryEntry(
  channelId: number,
  key: string
): Promise<DictionaryEntry | null> {
  if (collections.dictionary === undefined) {
    return null;
  }

  return await collections.dictionary.findOne({ channelId, key });
}

export async function updateDictionaryEntry(
  entry: DictionaryEntry
): Promise<boolean> {
  const channelId = entry.channelId;
  const key = entry.key;
  const result = await collections.dictionary?.updateOne(
    { channelId, key },
    { $set: entry },
    { upsert: true }
  );

  if (result) {
    return result.matchedCount > 0;
  }
  return false;
}

export async function deleteDictionaryEntry(
  channelId: number,
  key: string
): Promise<boolean> {
  const result = await collections.dictionary?.deleteOne({ channelId, key });

  if (result) {
    return result.deletedCount > 0;
  }
  return false;
}
