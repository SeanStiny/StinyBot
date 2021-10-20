import { findTimer, updateTimer } from '../../models/timer';
import { parseFlags } from '../flags/parse-flags';
import { applyTimerFlags } from '../flags/timer-flags';

export async function editTimer(
  args: string[],
  channelId: number
): Promise<string | undefined> {
  const alias = args[1];
  const timer = await findTimer(channelId, alias);

  if (timer) {
    const [flags, remainingArgs] = parseFlags(args.slice(3));
    applyTimerFlags(flags, timer);

    const timerResponse = remainingArgs.join(' ');
    if (timerResponse.length > 0) {
      timer.response = timerResponse;
    }

    await updateTimer(timer);
    return `Successfully updated the "${alias}" timer.`;
  } else {
    return `The "${alias}" timer doesn't exist.`;
  }
}
