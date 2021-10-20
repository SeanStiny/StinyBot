import { CommandFlags } from '../models/command';
import { isInteger } from '../utils/is-integer';

/**
 * Parse the command flags.
 * @returns a tuple containing the flags and remaining arguments.
 */
export function parseFlags(args: string[]): [CommandFlags, string[]] {
  const flags: CommandFlags = {};

  let i = 3;
  let stillFlags = true;
  while (stillFlags) {
    if (args[i] !== undefined && args[i].charAt(0) === '-') {
      const [flag, value] = args[i].substring(1).split('=', 2);

      switch (flag) {
        case 'mod':
          if (value === 'false') {
            flags.isMod = false;
          } else if (value === 'true' || value === '') {
            flags.isMod = true;
          }
          break;

        case 'vip':
          if (value === 'false') {
            flags.isVip = false;
          } else if (value === 'true' || value === '') {
            flags.isVip = true;
          }
          break;

        case 'sub':
          if (value === 'false') {
            flags.isSub = false;
          } else if (value === 'true' || value === '') {
            flags.isSub = true;
          }
          break;

        case 'cd':
        case 'cooldown':
          if (isInteger(value)) {
            flags.cooldown = Math.max(parseInt(value), 5);
          }
          break;
      }

      i++;
    } else {
      stillFlags = false;
    }
  }

  return [flags, args.slice(i)];
}
