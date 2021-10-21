import { ChatUserstate } from 'tmi.js';
import { add } from './add';
import { edit } from './edit';
import { join } from './join';
import { leave } from './leave';
import { remove } from './remove';
import { set } from './set';
import { unset } from './unset';

/**
 * Built-in commands that can be called from a user's chat.
 */
export const botCommands: Record<string, BuiltInCommand> = {
  '!add': add,
  '!remove': remove,
  '!edit': edit,
  '!set': set,
  '!unset': unset,
};

/**
 * Built-in commands that can be performed from the bot's own chat.
 */
export const adminCommands: Record<string, BuiltInCommand> = {
  '!join': join,
  '!leave': leave,
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
