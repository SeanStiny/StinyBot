import { ChatUserstate } from 'tmi.js';
import { chat } from '../chat';
import { adminCommands, userCommands } from '../commands';
import { config } from '../config';
import { logger } from '../logger';

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
  const userIsMod = userstate.badges?.moderator !== undefined;
  const userIsVip = userstate.badges?.vip !== undefined;
  const userIsSub = userstate.badges?.subscriber !== undefined;
  const inAdminChannel = channel.substring(1) === config.user;
  const args = message.split(' ');

  // Look for and execute a chat command.
  let response: string | undefined;
  const commands = inAdminChannel ? adminCommands : userCommands;
  const command = commands[args[0]];
  if (command) {
    const userHasPermission =
      (!command.isModOnly || userIsMod) &&
      (!command.isVipOnly || userIsVip) &&
      (!command.isSubOnly || userIsSub);
    if (userHasPermission) {
      response = await command.execute(args, channel, userstate, message);
    }
  }

  // Respond to a command in chat.
  if (response) {
    chat.say(channel, `/me ${response}`);
  }
}
