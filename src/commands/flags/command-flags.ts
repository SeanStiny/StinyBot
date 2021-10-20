import { Command } from '../../models/command';
import { isInteger } from '../../utils/is-integer';

/**
 * Apply the supplied flags to the new command.
 */
export function applyCommandFlags(
  flags: Record<string, string>,
  command: Command
): void {
  Object.keys(flags).forEach((key) => {
    const value = flags[key];

    switch (key) {
      case 'mod':
        command.isMod = value === 'true';
        break;

      case 'vip':
        command.isVip = value === 'true';
        break;

      case 'sub':
        command.isSub = value === 'true';
        break;

      case 'cd':
      case 'cooldown':
        if (isInteger(value)) {
          command.cooldown = Math.max(parseInt(value), 5);
        }
        break;
    }
  });
}
