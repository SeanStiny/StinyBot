import { ChatUserstate } from 'tmi.js';
import { joinCommand } from './join-command';
import { leaveCommand } from './leave-command';

/**
 * Built-in commands that can be called from a user's chat.
 */
export const botCommands: Record<string, BuiltInCommand> = {};

/**
 * Built-in commands that can be performed from the bot's own chat.
 */
export const adminCommands: Record<string, BuiltInCommand> = {
  '!join': joinCommand,
  '!leave': leaveCommand,
};

/**
 * An action performed in response to a chat command.
 */
export type BuiltInCommand = (
  args: string[],
  channel: string,
  userstate: ChatUserstate,
  message: string
) => Promise<string>;
