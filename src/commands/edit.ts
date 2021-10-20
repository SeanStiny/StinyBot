import { BuiltInCommand } from '.';
import { logger } from '../logger';
import { findCommand, updateCommand } from '../models/command';
import { parseFlags } from './parse-flags';

/**
 * Example usage.
 */
const example = '!edit !hello command Bye, chat.';

/**
 * Edit a chat command.
 */
export const edit: BuiltInCommand = async (args, channel, userstate) => {
  let response: string | undefined;

  if (userstate['room-id']) {
    let type = args[2];
    if (type !== undefined) {
      type = type.toLowerCase();

      // Edit a command.
      if (type === 'command') {
        const trigger = args[1];

        if (trigger) {
          const channelId = parseInt(userstate['room-id']);
          const command = await findCommand(channelId, trigger);

          if (command) {
            const [flags, remainingArgs] = parseFlags(args);
            const commandResponse = remainingArgs.join(' ');

            // Update the response
            if (commandResponse.length > 0) {
              command.response = commandResponse;
            }

            // Update the flags
            if (Object.keys(flags).length > 0) {
              command.flags = flags;
            }

            await updateCommand(command);
            response =
              `@${userstate['display-name']} ` +
              `Successfully edited the ${command.trigger} command.`;
          } else {
            response =
              `@${userstate['display-name']} ` +
              `The ${trigger} command doesn't exist.`;
          }
        } else {
          response =
            `@${userstate['display-name']} You didn't specify a ` +
            `trigger for the command. Example usage: "${example}"`;
        }
      } else {
        response = `@${userstate['display-name']} Unknown type: ${type}`;
      }
    } else {
      response =
        `@${userstate['display-name']} Please specify what you would like ` +
        `to edit. Example usage: "${example}"`;
    }
  } else {
    logger.error('Called !edit from an unknown channel.');
  }

  return response;
};
