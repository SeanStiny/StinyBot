import { MongoServerError } from 'mongodb';
import { Command, insertCommand } from '../../models/command';
import { applyCommandFlags } from '../flags/command-flags';
import { parseFlags } from '../flags/parse-flags';

/**
 * Example usage.
 */
const EXAMPLE = '!add !hello command Hello, chat.';

/**
 * Add a new command through chat.
 */
export async function addCommand(
  args: string[],
  channelId: number,
  user: string
): Promise<string> {
  const trigger = args[1];

  if (trigger) {
    const [flags, remainingArgs] = parseFlags(args.slice(3));
    const commandResponse = remainingArgs.join(' ');

    if (commandResponse.length > 0) {
      if (trigger && commandResponse) {
        const command = new Command(channelId, trigger, commandResponse);

        applyCommandFlags(flags, command);

        try {
          const created = await insertCommand(command);
          if (created) {
            return `@${user} Successfully added the ${command.trigger} command.`;
          }
        } catch (reason) {
          if (reason instanceof MongoServerError && reason.code === 11000) {
            return `@${user} The ${command.trigger} command already exists.`;
          }
          return `@${user} The ${command.trigger} command already exists.`;
        }
      }
    }
    return (
      `@${user} You didn't specify a response for the command. ` +
      `Example usage: "${EXAMPLE}"`
    );
  }
  return (
    `@${user} You didn't specify a trigger for the command. ` +
    `Example usage: "${EXAMPLE}"`
  );
}
