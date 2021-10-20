import { BuiltInCommand } from '..';
import { logger } from '../../logger';
import { editCommand } from './edit-command';

/**
 * Example usage.
 */
const EXAMPLE = '!edit !hello command Bye, chat.';

/**
 * Edit a chat command.
 */
export const edit: BuiltInCommand = async (args, channel, userstate) => {
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
        // Edit an existing command.
        case 'command':
          response = await editCommand(args, channelId, user);
          break;

        default:
          response = `@${user} Unknown type: ${type}`;
      }
    } else {
      response =
        `@${user} Please specify what you would like to edit. ` +
        `Example usage: "${EXAMPLE}"`;
    }
  } else {
    logger.error('Called !edit from an unknown channel.');
  }

  return response;
};
