import { Action } from '.';

/**
 * Respond with a message in chat.
 */
export const respondAction: Action = async (
  args,
  channel,
  userstate,
  message,
  command
) => {
  return command.action.response;
};
