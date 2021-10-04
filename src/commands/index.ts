import { ChatUserstate } from 'tmi.js';
import { joinCommand } from './join-command';
import { leaveCommand } from './leave-command';

/**
 * Commands that can be called from a user's chat.
 */
export const userCommands: Record<string, Command> = {};

/**
 * Commands that can be called from the bot's own chat.
 */
export const adminCommands: Record<string, Command> = {
  '!join': joinCommand,
  '!leave': leaveCommand,
};

/**
 * A chat command.
 */
export interface Command {
  cooldown?: number;
  isModOnly?: boolean;
  isVipOnly?: boolean;
  isSubOnly?: boolean;

  execute: (
    args: string[],
    channel: string,
    userstate: ChatUserstate,
    message: string
  ) => Promise<string>;
}
