import { ChatUserstate } from 'tmi.js';
import { adminActions, userActions } from '../actions';
import { chat } from '../chat';
import { config } from '../config';
import { logger } from '../logger';
import { findCommand } from '../models/command';

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
      const action = adminActions[args[0].toLowerCase()];
      if (action !== undefined) {
        response = await action(args, channel, userstate, message);
      }
    }
  } else {
    // User commands
    const channelId = parseInt(userstate['room-id'] || '-1');
    const command = await findCommand(channelId, args[0].toLowerCase());

    if (command !== null) {
      const userHasPermission =
        userIsBroadcaster ||
        (command.opts?.isMod && userIsMod) ||
        (command.opts?.isVip && userIsVip) ||
        (command.opts?.isSub && userIsSub);
      if (userHasPermission) {
        const action = userActions[command.action.kind];
        response = await action(args, channel, userstate, message, command);
      }
    }
  }

  // Respond to a command in chat.
  if (response) {
    chat.say(channel, `/me ${response}`);
  }
}
