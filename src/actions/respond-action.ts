import { Action } from '.';

export const respondAction: Action = async (
  args,
  channel,
  userstate,
  message,
  command
) => {
  return command.action.response;
};
