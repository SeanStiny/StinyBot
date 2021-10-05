import { Command } from '.';

/**
 * Call a built-in user command.
 */
export const botCommand: Command = {
  execute: async (args, channel, userstate) => {
    const userHasPermission =
      userstate.badges?.moderator !== undefined ||
      userstate.badges?.broadcaster !== undefined;

    if (userHasPermission && args.length > 1) {
      // TODO: built-in user commands
    }
    return `@${userstate['display-name']} Hi! I was created by @SeanStiny. If you would like me in your chat too, let him know! <3`;
  },
};
