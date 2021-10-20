import { deleteCommand } from '../../models/command';

/**
 * Example usage.
 */
const EXAMPLE = '!remove !hello command';

/**
 * Remove a command through chat.
 */
export async function removeCommand(
  args: string[],
  channelId: number,
  user: string
): Promise<string> {
  const trigger = args[1];

  if (trigger) {
    const removed = await deleteCommand(channelId, trigger);
    if (removed) {
      return `@${user} Successfully removed the ${trigger} command.`;
    }
    return (
      `@${user} ` +
      `The ${trigger} command does not exist or cannot be removed.`
    );
  }
  return (
    `@${user} You didn't specify the command ` +
    `you want to remove. Example usage: "${EXAMPLE}"`
  );
}
