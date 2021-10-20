import { BuiltInCommand } from '..';
import { logger } from '../../logger';
import { addCommand } from './add-command';

/**
 * Example usage.
 */
const EXAMPLE = '!add !hello command Hello, chat.';

/**
 * Add a chat command.
 */
export const add: BuiltInCommand = async (args, channel, userstate) => {
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
        // Add a new command.
        case 'command':
          response = await addCommand(args, channelId, user);
          break;

        default:
          response = `@${user} Unknown type: ${type}`;
      }
    } else {
      response =
        `@${user} Please specify what you would like ` +
        `to add. Example usage: "${EXAMPLE}"`;
    }
  } else {
    logger.error('Called !add from an unknown channel.');
  }

  return response;
};
