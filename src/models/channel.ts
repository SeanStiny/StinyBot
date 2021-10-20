import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * A Twitch chat channel.
 */
export class Channel {
  name: string;
  lastActive?: number;

  constructor(name: string, readonly _id?: ObjectId) {
    this.name = sanitizeName(name);
  }
}

/**
 * @param channel The new channel to insert into the database.
 */
export async function insertChannel(channel: Channel): Promise<boolean> {
  const result = await collections.channels?.insertOne(channel);
  return result?.acknowledged || false;
}

/**
 * @returns An array containing every channel stored in the database.
 */
export async function allChannels(): Promise<Channel[]> {
  return (await collections.channels?.find({}).toArray()) || [];
}

/**
 * @param name The Twitch chat channel name.
 */
export async function findChannel(name: string): Promise<Channel | null> {
  name = sanitizeName(name);
  return (await collections.channels?.findOne({ name })) || null;
}

/**
 * Find all of the recently active channels within a time period.
 */
export async function findActiveChannels(time: number): Promise<Channel[]> {
  const result = await collections.channels
    ?.find({
      lastActive: { $gte: Date.now() - time },
    })
    .toArray();

  if (result) {
    return result;
  }
  return [];
}

/**
 * @param name The channel name.
 */
export async function deleteChannel(name: string): Promise<boolean> {
  name = sanitizeName(name);
  const result = await collections.channels?.deleteOne({ name });
  return result?.acknowledged || false;
}

/**
 * Set a channel's last active property to the current time.
 */
export async function updateChannelLastActive(name: string): Promise<boolean> {
  const result = await collections.channels?.updateOne(
    { name },
    { $set: { lastActive: Date.now() } }
  );

  if (result) {
    return result.matchedCount > 0;
  }
  return false;
}

/**
 * Convert a name into the format '#channelname'
 */
function sanitizeName(name: string) {
  name = name.toLowerCase();
  if (name.charAt(0) !== '#') {
    name = `#${name}`;
  }
  return name;
}
