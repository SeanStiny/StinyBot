import { BuiltInCommand } from '..';
import { logger } from '../../logger';
import { addCommand } from './add-command';
import { addTimer } from './add-timer';

/**
 * Example usage.
 */
const EXAMPLE = '!add !hello command Hello, chat.';

/**
 * Add a chat command.
 */
export const add: BuiltInCommand = async (args, channel, userstate) => {
  let response =
    `I'm sorry, something went wrong. ` +
    'Try again! If the problem persists, seek help.';

  if (userstate['room-id'] && userstate['display-name']) {
    let type = args[2];

    if (type !== undefined) {
      type = type.toLowerCase();
      let typeResponse: string | undefined;
      const channelId = parseInt(userstate['room-id']);

      switch (type) {
        // Add a new command.
        case 'command':
          typeResponse = await addCommand(args, channelId);
          break;

        // Add a new timer.
        case 'timer':
          typeResponse = await addTimer(args, channelId);
          break;

        default:
          typeResponse = `Unknown type: ${type}`;
      }

      if (typeResponse) {
        response = typeResponse;
      }
    } else {
      response =
        `Please specify what you would like ` +
        `to add. Example usage: "${EXAMPLE}"`;
    }
    response = `@${userstate['display-name']} ${response}`;
  } else {
    logger.error('Called !add from an unknown channel.');
  }

  return response;
};
