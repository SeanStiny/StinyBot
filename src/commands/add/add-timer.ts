import { MongoServerError } from 'mongodb';
import { insertTimer, Timer } from '../../models/timer';
import { parseFlags } from '../flags/parse-flags';
import { applyTimerFlags } from '../flags/timer-flags';

/**
 * Example usage.
 */
const EXAMPLE = '!add hello timer Hello, chat.';

/**
 * Add a new timer through chat.
 */
export async function addTimer(
  args: string[],
  channelId: number
): Promise<string> {
  const alias = args[1];
  const [flags, remainingArgs] = parseFlags(args.slice(3));
  const timerResponse = remainingArgs.join(' ');

  if (timerResponse.length > 0) {
    const timer = new Timer(channelId, alias, timerResponse);

    applyTimerFlags(flags, timer);

    try {
      await insertTimer(timer);
      return `Successfully added the ${timer.alias} timer.`;
    } catch (reason) {
      if (reason instanceof MongoServerError && reason.code === 11000) {
        return `The ${timer.alias} timer already exists.`;
      }
    }
  }
  return `You must specify a message for the timer. Example usage: ${EXAMPLE}`;
}
