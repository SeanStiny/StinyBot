import { BuiltInCommand } from '.';
import { logger } from '../logger';
import { DictionaryEntry, updateDictionaryEntry } from '../models/dictionary';

/**
 * Example usage.
 */
const EXAMPLE = '!set example This is an example.';

/**
 * Set a dictionary value through chat.
 */
export const set: BuiltInCommand = async (args, channel, userstate) => {
  let response =
    `I'm sorry, something went wrong. ` +
    'Try again! If the problem persists, seek help.';

  if (userstate['room-id'] && userstate['display-name']) {
    let key = args[1];

    if (key) {
      key = key.toLowerCase();

      if (args.length > 2) {
        const value = args.slice(2).join(' ');

        if (value.length > 0) {
          const channelId = parseInt(userstate['room-id']);
          const entry = new DictionaryEntry(channelId, key, value);
          await updateDictionaryEntry(entry);
          response = `${entry.key} has been set to: ${entry.value}`;
        }
      }
    } else {
      response = `You must provide a dictionary key. Example usage: ${EXAMPLE}`;
    }

    response = `@${userstate['display-name']} ${response}`;
  } else {
    logger.error('Called !set from an unknown channel.');
  }

  return response;
};
