import { ChatUserstate } from 'tmi.js';
import { adminCommands, botCommands } from '../commands';
import { chat } from '../chat';
import { config } from '../config';
import { logger } from '../logger';
import { findCommand, updateCommand } from '../models/command';
import { parseResponse } from '../response';
import { commandVariables } from '../variables';

/**
 * Listen for a chat message event.
 */
export async function chatMessage(
  channel: string,
  userstate: ChatUserstate,
  message: string,
  self: boolean
): Promise<void> {
  // Skip messages from the bot.
  if (self) {
    return;
  }

  logger.info(`${channel} [${userstate['display-name']}]: ${message}`);

  // User information.
  const userIsBroadcaster = userstate.badges?.broadcaster !== undefined;
  const userIsMod = userstate.badges?.moderator !== undefined;
  const userIsVip = userstate.badges?.vip !== undefined;
  const userIsSub = userstate.badges?.subscriber !== undefined;
  const inAdminChannel = channel.substring(1) === config.user;
  const args = message.split(' ');

  // Look for and execute a chat command.
  let response: string | undefined;

  if (inAdminChannel) {
    // Admin commands
    if (userIsMod) {
      const adminCommand = adminCommands[args[0].toLowerCase()];
      if (adminCommand !== undefined) {
        response = await adminCommand(args, channel, userstate, message);
      }
    }
  } else {
    // Bot commands
    const botCommand = botCommands[args[0]];
    if (botCommand && (userIsBroadcaster || userIsMod)) {
      response = await botCommand(args, channel, userstate, message);

      if (response === undefined) {
        response =
          `@${userstate['display-name']} I'm sorry, something went wrong. ` +
          'Try again! If the problem persists, seek help.';
      }
    } else {
      // User commands
      const channelId = parseInt(userstate['room-id'] || '-1');
      const command = await findCommand(channelId, args[0].toLowerCase());

      if (command !== null) {
        const userHasPermission =
          userIsBroadcaster ||
          (!command.flags?.isMod &&
            !command.flags?.isSub &&
            !command.flags?.isVip) ||
          (command.flags?.isMod && userIsMod) ||
          (command.flags?.isVip && userIsVip) ||
          (command.flags?.isSub && userIsSub);

        const cooldownOver =
          !command.lastUsed ||
          !command.flags?.cooldown ||
          (Date.now() - command.lastUsed) / 1000 > command.flags.cooldown;

        if (userHasPermission && cooldownOver) {
          const variables = commandVariables(channel, userstate, message);
          response = await parseResponse(command.response, variables);
          command.lastUsed = Date.now();
          updateCommand(command);
        }
      }
    }
  }

  // Respond to a command in chat.
  if (response) {
    chat.say(channel, `/me ${response}`);
  }
}
