import { ChatUserstate } from 'tmi.js';
import { Command } from '../models/command';
import { joinAction } from './join-action';
import { leaveAction } from './leave-action';
import { respondAction } from './respond-action';

/**
 * Commands that can be called from a user's chat.
 */
export const userActions: Record<string, Action> = {
  respond: respondAction,
};

/**
 * Actions that can be performed from the bot's own chat.
 */
export const adminActions: Record<string, AdminAction> = {
  '!join': joinAction,
  '!leave': leaveAction,
};

/**
 * A chat command.
 */
export type Action = (
  args: string[],
  channel: string,
  userstate: ChatUserstate,
  message: string,
  command: Command
) => Promise<string>;

export type AdminAction = (
  args: string[],
  channel: string,
  userstate: ChatUserstate,
  message: string
) => Promise<string>;
