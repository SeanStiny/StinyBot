import { ChatUserstate } from 'tmi.js';
import { Variable } from '.';
import { StreamVariable } from './StreamVariable';
import { StringVariable } from './StringVariable';
import { TwitchGameVariable } from './TwitchGameVariable';
import { TwitchLanguageVariable } from './TwitchLanguageVariable';
import { TwitchNameVariable } from './TwitchNameVariable';
import { TwitchTitleVariable } from './TwitchTitleVariable';

export function commandVariables(
  channel: string,
  userstate: ChatUserstate,
  message: string
): Record<string, Variable> {
  // Command context.
  channel = channel.substring(1);
  const variables: Record<string, Variable> = {};
  const channelId = parseInt(userstate['room-id'] || '-1');
  const args = message.split(' ');

  // Argument variables.
  args.slice(1).forEach((arg, index) => {
    variables[index + 1] = new StringVariable(arg);
  });

  // Channel information variables.
  variables.channel = new StringVariable(channel);
  variables.name = new TwitchNameVariable(channelId);
  variables.language = new TwitchLanguageVariable(channelId);
  variables.game = new TwitchGameVariable(channelId);
  variables.title = new TwitchTitleVariable(channelId);

  // Command text variable
  variables.text = new StringVariable(message.substring(args[0].length));

  // Stream information variables
  variables.stream = new StreamVariable(channel);

  return variables;
}
