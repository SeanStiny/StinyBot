import { BuiltInCommand } from '..';
import { logger } from '../../logger';
import { editCommand } from './edit-command';
import { editTimer } from './edit-timer';

/**
 * Example usage.
 */
const EXAMPLE = '!edit !hello command Bye, chat.';

/**
 * Edit a chat command.
 */
export const edit: BuiltInCommand = async (args, channel, userstate) => {
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
        // Edit a command.
        case 'command':
          typeResponse = await editCommand(args, channelId);
          break;

        // Edit a timer.
        case 'timer':
          typeResponse = await editTimer(args, channelId);
          break;

        default:
          response = `Unknown type: ${type}`;
      }

      if (typeResponse) {
        response = typeResponse;
      }
    } else {
      response =
        `Please specify what you would like to edit. ` +
        `Example usage: "${EXAMPLE}"`;
    }
    response = `@${userstate['display-name']} ${response}`;
  } else {
    logger.error('Called !edit from an unknown channel.');
  }

  return response;
};
