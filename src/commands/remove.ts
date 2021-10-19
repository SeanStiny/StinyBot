import { BuiltInCommand } from '.';
import { logger } from '../logger';
import { deleteCommand } from '../models/command';

/**
 * Example usage.
 */
const example = '!remove !hello command';

/**
 * Remove a chat command.
 */
export const remove: BuiltInCommand = async (args, channel, userstate) => {
  let response =
    `@${userstate['display-name']} I'm sorry, something went wrong. ` +
    'Try again! If the problem persists, seek help.';

  if (userstate['room-id']) {
    let type = args[2];

    if (type !== undefined) {
      type = type.toLowerCase();
      if (type === 'command') {
        const trigger = args[1];

        if (trigger) {
          const channelId = parseInt(userstate['room-id']);
          const removed = await deleteCommand(channelId, trigger);
          if (removed) {
            response =
              `@${userstate['display-name']} ` +
              `Successfully removed the ${trigger} command.`;
          } else {
            response =
              `@${userstate['display-name']} ` +
              `The ${trigger} command does not exist or cannot be removed.`;
          }
        } else {
          response =
            `@${userstate['display-name']} You didn't specify the command ` +
            `you want to remove. Example usage: "${example}"`;
        }
      } else {
        response = `@${userstate['display-name']} Unknown type: ${type}`;
      }
    } else {
      response =
        `@${userstate['display-name']} Please specify what you would like ` +
        `to remove. Example usage: "${example}"`;
    }
  } else {
    logger.error('Called !remove from an unknown channel.');
  }

  return response;
};
