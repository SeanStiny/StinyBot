import { ObjectId } from 'mongodb';
import { collections } from '../database';

/**
 * A chat command that performs an action when triggered.
 */
export class Command {
  isMod: boolean;
  isVip: boolean;
  isSub: boolean;
  cooldown: number;
  lastUsed?: number;

  constructor(
    public channelId: number,
    public trigger: string,
    public response: string,
    public _id?: ObjectId
  ) {
    this.trigger = trigger.toLowerCase();
    this.isMod = false;
    this.isVip = false;
    this.isSub = false;
    this.cooldown = 5;
  }
}

/**
 * Inserts a new command.
 */
export async function insertCommand(command: Command): Promise<void> {
  await collections.commands?.insertOne(command);
}

/**
 * Updates an existing command.
 */
export async function updateCommand(command: Command): Promise<boolean> {
  const result = await collections.commands?.updateOne(
    {
      channelId: command.channelId,
      trigger: command.trigger,
    },
    {
      $set: command,
    }
  );
  return result?.acknowledged || false;
}

/**
 * Find a command if it exists.
 */
export async function findCommand(
  channelId: number,
  trigger: string
): Promise<Command | null> {
  return (await collections.commands?.findOne({ channelId, trigger })) || null;
}

/**
 * Delete a command if it exists.
 */
export async function deleteCommand(
  channelId: number,
  trigger: string
): Promise<boolean> {
  const result = await collections.commands?.deleteOne({ channelId, trigger });
  return result === undefined ? false : result.deletedCount > 0;
}
