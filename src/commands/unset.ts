import { BuiltInCommand } from '.';
import { logger } from '../logger';
import { deleteDictionaryEntry } from '../models/dictionary';

/**
 * Example usage.
 */
const EXAMPLE = '!unset example';

/**
 * Remove a dictionary value through chat.
 */
export const unset: BuiltInCommand = async (args, channel, userstate) => {
  let response =
    `I'm sorry, something went wrong. ` +
    'Try again! If the problem persists, seek help.';

  if (userstate['room-id'] && userstate['display-name']) {
    let key = args[1];

    if (key) {
      key = key.toLowerCase();

      const channelId = parseInt(userstate['room-id']);
      await deleteDictionaryEntry(channelId, key);
      response = `Successfully unset ${key}.`;
    } else {
      response = `You must provide a dictionary key. Example usage: ${EXAMPLE}`;
    }

    response = `@${userstate['display-name']} ${response}`;
  } else {
    logger.error('Called !set from an unknown channel.');
  }

  return response;
};
