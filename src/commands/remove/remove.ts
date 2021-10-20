import { BuiltInCommand } from '..';
import { logger } from '../../logger';
import { removeCommand } from './remove-command';

/**
 * Example usage.
 */
const EXAMPLE = '!remove !hello command';

/**
 * Remove a chat command.
 */
export const remove: BuiltInCommand = async (args, channel, userstate) => {
  let response =
    `@${userstate['display-name']} I'm sorry, something went wrong. ` +
    'Try again! If the problem persists, seek help.';

  if (userstate['room-id'] && userstate['display-name']) {
    const user = userstate['display-name'];
    let type = args[2];

    if (type !== undefined) {
      type = type.toLowerCase();
      const channelId = parseInt(userstate['room-id']);

      switch (type) {
        // Remove a command.
        case 'command':
          response = await removeCommand(args, channelId, user);
          break;

        default:
          response = `@${user} Unknown type: ${type}`;
      }
    } else {
      response =
        `@${user} Please specify what you would like ` +
        `to remove. Example usage: "${EXAMPLE}"`;
    }
  } else {
    logger.error('Called !remove from an unknown channel.');
  }

  return response;
};
