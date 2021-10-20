import { deleteCommand } from '../../models/command';

/**
 * Remove a command through chat.
 */
export async function removeCommand(
  args: string[],
  channelId: number
): Promise<string> {
  const trigger = args[1];

  const removed = await deleteCommand(channelId, trigger);
  if (removed) {
    return `Successfully removed the ${trigger} command.`;
  }
  return `The ${trigger} command does not exist or cannot be removed.`;
}
