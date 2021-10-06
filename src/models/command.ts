import { ObjectId } from 'mongodb';
import { collections } from '../database';
import { RespondOptions } from './commands/respond-command';

/**
 * A chat command that performs an action when triggered.
 */
export interface Command {
  channelId: number;
  trigger: string;
  action: ActionOptions;
  opts?: {
    isMod?: boolean;
    isVip?: boolean;
    isSub?: boolean;
    cooldown?: number;
  };
  _id?: ObjectId;
}

/**
 * Updates a command. If the command doesn't exist, it will be inserted.
 */
export async function updateCommand(command: Command): Promise<boolean> {
  const result = await collections.commands?.updateOne(
    {
      channelId: command.channelId,
      trigger: command.trigger,
    },
    {
      $set: command,
    },
    { upsert: true }
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
  return result?.acknowledged || false;
}

export { RespondCommand } from './commands/respond-command';

/**
 * The type of action the command should perform.
 */
export type ActionOptions = RespondOptions;
