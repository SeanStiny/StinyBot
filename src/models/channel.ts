import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * A Twitch chat channel.
 */
export class Channel {
  constructor(public name: string, public _id: ObjectId) {}
}

/**
 * @param channel The new channel to insert into the database.
 */
export async function insertChannel(channel: Channel): Promise<void> {
  const result = await collections.channels?.insertOne(channel);
  console.log(result);
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
  return (await collections.channels?.findOne({ channelId: name })) as Channel;
}

/**
 * @param name The channel name.
 */
export async function deleteChannel(name: string): Promise<void> {
  const result = await collections.channels?.deleteOne({ name });
  console.log(result);
}
