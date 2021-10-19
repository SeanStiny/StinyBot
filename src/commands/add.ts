import { MongoServerError } from 'mongodb';
import { BuiltInCommand } from '.';
import { logger } from '../logger';
import { Command, CommandFlags, insertCommand } from '../models/command';
import { isInteger } from '../utils/is-integer';

/**
 * Example usage.
 */
const example = '!add !hello command Hello, chat.';

/**
 * Add a chat command.
 */
export const add: BuiltInCommand = async (args, channel, userstate) => {
  let response: string | undefined;

  if (userstate['room-id']) {
    let type = args[2];
    if (type !== undefined) {
      type = type.toLowerCase();

      // Add a new command.
      if (type === 'command') {
        const trigger = args[1];

        if (trigger) {
          const [flags, remainingArgs] = parseFlags(args);
          const commandResponse = remainingArgs.join(' ');

          if (commandResponse.length > 0) {
            if (trigger && commandResponse) {
              const channelId = parseInt(userstate['room-id']);
              const command = new Command(channelId, trigger, commandResponse);
              if (flags) {
                command.flags = flags;
              }

              try {
                const created = await insertCommand(command);
                if (created) {
                  response =
                    `@${userstate['display-name']} ` +
                    `Successfully added the ${command.trigger} command.`;
                }
              } catch (reason) {
                if (
                  reason instanceof MongoServerError &&
                  reason.code === 11000
                ) {
                  response =
                    `@${userstate['display-name']} ` +
                    `The ${command.trigger} command already exists.`;
                }
              }
            }
          } else {
            response =
              `@${userstate['display-name']} You didn't specify a ` +
              `response for the command. Example usage: "${example}"`;
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
        `to add. Example usage: "${example}"`;
    }
  } else {
    logger.error('Called !add from an unknown channel.');
  }

  return response;
};

/**
 * Parse the command flags.
 * @returns a tuple containing the flags and remaining arguments.
 */
function parseFlags(args: string[]): [CommandFlags, string[]] {
  const flags: CommandFlags = {};

  let i = 3;
  let stillFlags = true;
  while (stillFlags) {
    if (args[i] !== undefined && args[i].charAt(0) === '-') {
      const [flag, value] = args[i].substring(1).split('=', 2);

      switch (flag) {
        case 'mod':
          flags.isMod = true;
          break;

        case 'vip':
          flags.isVip = true;
          break;

        case 'sub':
          flags.isSub = true;
          break;

        case 'cd':
        case 'cooldown':
          if (isInteger(value)) {
            flags.cooldown = Math.max(parseInt(value), 5);
          }
          break;
      }

      i++;
    } else {
      stillFlags = false;
    }
  }

  return [flags, args.slice(i)];
}
