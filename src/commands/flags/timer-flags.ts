import { Timer } from '../../models/timer';
import { isInteger } from '../../utils/is-integer';

/**
 * Apply the supplied flags to the timer.
 */
export function applyTimerFlags(
  flags: Record<string, string>,
  timer: Timer
): void {
  Object.keys(flags).forEach((key) => {
    const value = flags[key];

    switch (key) {
      case 'offset':
        if (isInteger(value)) {
          timer.offset = parseInt(value);
        }
        break;

      case 'interval':
        if (isInteger(value)) {
          timer.interval = parseInt(value);
        }
        break;
    }
  });
}
