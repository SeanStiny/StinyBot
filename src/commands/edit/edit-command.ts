import { findCommand, updateCommand } from '../../models/command';
import { applyCommandFlags } from '../flags/command-flags';
import { parseFlags } from '../flags/parse-flags';

/**
 * Edit a command through chat.
 */
export async function editCommand(
  args: string[],
  channelId: number
): Promise<string> {
  const trigger = args[1];
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
    return `Successfully edited the ${command.trigger} command.`;
  }
  return `The ${trigger} command doesn't exist.`;
}
