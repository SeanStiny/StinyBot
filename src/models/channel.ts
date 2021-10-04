import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * A Twitch chat channel.
 */
export class Channel {
  name: string;

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
  return (await collections.channels?.find({}).toArray()) as Channel[];
}

/**
 * @param name The Twitch chat channel name.
 */
export async function findChannelByName(name: string): Promise<Channel> {
  name = sanitizeName(name);
  return (await collections.channels?.findOne({ name })) as Channel;
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
 * Convert a name into the format '#channelname'
 */
function sanitizeName(name: string) {
  name = name.toLowerCase();
  if (name.charAt(0) !== '#') {
    name = `#${name}`;
  }
  return name;
}
