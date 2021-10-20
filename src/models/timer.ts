import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * Chat message timer.
 */
export class Timer {
  interval: number;
  offset: number;

  constructor(
    public channelId: number,
    public alias: string,
    public response: string,
    public _id?: ObjectId
  ) {
    this.interval = 15;
    this.offset = 0;
  }
}

/**
 * Find all of the timers belonging to a list of channels.
 */
export async function findTimers(channelIds: number[]): Promise<Timer[]> {
  const result = await collections.timers
    ?.find({ channelId: { $in: channelIds } })
    .toArray();

  if (result) {
    return result;
  }
  return [];
}

/**
 * Find all of the timers belonging to a channel.
 */
export async function findTimer(
  channelId: number,
  alias: string
): Promise<Timer | null> {
  if (collections.timers) {
    const timer = await collections.timers.findOne({ channelId, alias });
    return timer;
  }
  return null;
}

/**
 * Save a new timer.
 */
export async function insertTimer(timer: Timer): Promise<void> {
  await collections.timers?.insertOne(timer);
}

/**
 * Update an existing timer.
 */
export async function updateTimer(timer: Timer): Promise<boolean> {
  const channelId = timer.channelId;
  const name = timer.alias;
  const result = await collections.timers?.updateOne(
    { channelId, alias: name },
    { $set: timer }
  );

  if (result) {
    return result.matchedCount > 0;
  }
  return false;
}

/**
 * Delete a timer.
 */
export async function deleteTimer(
  channelId: number,
  alias: string
): Promise<boolean> {
  const result = await collections.timers?.deleteOne({ channelId, alias });

  if (result) {
    return result.deletedCount > 0;
  }
  return false;
}
