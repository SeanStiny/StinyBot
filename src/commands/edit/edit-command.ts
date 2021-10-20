import { findCommand, updateCommand } from '../../models/command';
import { applyCommandFlags } from '../flags/command-flags';
import { parseFlags } from '../flags/parse-flags';

/**
 * Example usage.
 */
const EXAMPLE = '!edit !hello command Bye, chat.';

/**
 * Edit a command through chat.
 */
export async function editCommand(
  args: string[],
  channelId: number,
  user: string
): Promise<string> {
  const trigger = args[1];

  if (trigger) {
    const command = await findCommand(channelId, trigger);

    if (command) {
      const [flags, remainingArgs] = parseFlags(args.slice(3));
      const commandResponse = remainingArgs.join(' ');

      // Update the response
      if (commandResponse.length > 0) {
        command.response = commandResponse;
      }

      applyCommandFlags(flags, command);

      await updateCommand(command);
      return `@${user} Successfully edited the ${command.trigger} command.`;
    }
    return `@${user} The ${trigger} command doesn't exist.`;
  }
  return (
    `@${user} You didn't specify a trigger for the command. ` +
    `Example usage: "${EXAMPLE}"`
  );
}
