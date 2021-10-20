import { BuiltInCommand } from '..';
import { logger } from '../../logger';
import { removeCommand } from './remove-command';
import { removeTimer } from './remove-timer';

/**
 * Example usage.
 */
const EXAMPLE = '!remove !hello command';

/**
 * Remove a chat command.
 */
export const remove: BuiltInCommand = async (args, channel, userstate) => {
  let response =
    `I'm sorry, something went wrong. ` +
    'Try again! If the problem persists, seek help.';

  if (userstate['room-id'] && userstate['display-name']) {
    let type = args[2];

    if (type !== undefined) {
      type = type.toLowerCase();
      const channelId = parseInt(userstate['room-id']);

      switch (type) {
        // Remove a command.
        case 'command':
          response = await removeCommand(args, channelId);
          break;

        // Remove a timer.
        case 'timer':
          response = await removeTimer(args, channelId);
          break;

        default:
          response = `Unknown type: ${type}`;
      }
    } else {
      response =
        `Please specify what you would like ` +
        `to remove. Example usage: "${EXAMPLE}"`;
    }

    response = `@${userstate['display-name']} ${response}`;
  } else {
    logger.error('Called !remove from an unknown channel.');
  }

  return response;
};
