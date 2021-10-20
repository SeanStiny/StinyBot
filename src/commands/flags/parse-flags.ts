/**
 * Parse the command flags.
 * @returns a tuple containing the flags and remaining arguments.
 */
export function parseFlags(args: string[]): [Record<string, string>, string[]] {
  const flags: Record<string, string> = {};

  let i = 0;
  while (i < args.length && args[i].charAt(0) === '-') {
    const split = args[i].substring(1).split('=', 2);
    const key = split[0];
    let value = split[1];

    if (value.length === 0) {
      value = 'true';
    }
    flags[key] = value;

    i++;
  }

  return [flags, args.slice(i)];
}
