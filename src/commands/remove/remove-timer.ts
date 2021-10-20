import { deleteTimer } from '../../models/timer';

/**
 * Remove a timer through chat.
 */
export async function removeTimer(
  args: string[],
  channelId: number
): Promise<string> {
  const alias = args[1];

  const removed = await deleteTimer(channelId, alias);
  if (removed) {
    return `Successfully removed the "${alias}" timer.`;
  }
  return `The "${alias}" timer does not exist.`;
}
