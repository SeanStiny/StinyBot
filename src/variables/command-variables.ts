import { ChatUserstate } from 'tmi.js';
import { Variable } from '.';
import { ChannelGameVariable } from './ChannelGameVariable';
import { ChannelLanguageVariable } from './ChannelLanguageVariable';
import { ChannelNameVariable } from './ChannelNameVariable';
import { ChannelTitleVariable } from './ChannelTitleVariable';
import { StreamUptimeVariable } from './StreamUptimeVariable';
import { StreamVariable } from './StreamVariable';
import { StringVariable } from './StringVariable';
import { UserGameVariable } from './UserGameVariable';
import { UserLanguageVariable } from './UserLanguageVariable';
import { UserLoginVariable } from './UserLoginVariable';
import { UserNameVariable } from './UserNameVariable';
import { UserTitleVariable } from './UserTitleVariable';

export function commandVariables(
  channel: string,
  userstate: ChatUserstate,
  message: string
): Record<string, Variable> {
  if (
    !userstate['room-id'] ||
    !userstate['display-name'] ||
    !userstate['user-id'] ||
    !userstate.username
  ) {
    throw 'Invalid userstate was passed to commandVariables.';
  }

  // Command context.
  channel = channel.substring(1);
  const variables: Record<string, Variable> = {};
  const channelId = parseInt(userstate['room-id']);
  const userId = parseInt(userstate['user-id']);
  const args = message.split(' ');

  // Argument variables.
  args.slice(1).forEach((arg, index) => {
    variables[index + 1] = new StringVariable(arg);
  });

  // Channel information variables.
  variables.channel = new StringVariable(channel);
  variables.name = new ChannelNameVariable(channelId);
  variables.language = new ChannelLanguageVariable(channelId);
  variables.game = new ChannelGameVariable(channelId);
  variables.title = new ChannelTitleVariable(channelId);

  // Command text variable
  variables.text = new StringVariable(message.substring(args[0].length));

  // Stream information variables
  variables.stream = new StreamVariable(channel);
  variables.uptime = new StreamUptimeVariable(channel);

  // Command user variables
  variables.user = new StringVariable(userstate['display-name']);

  // Target variables
  if (args.length > 1) {
    const login = args[1];
    variables.target = new UserNameVariable(login);
    variables['target name'] = variables.target;
    variables['target channel'] = new UserLoginVariable(login);
    variables['target language'] = new UserLanguageVariable(login);
    variables['target game'] = new UserGameVariable(login);
    variables['target title'] = new UserTitleVariable(login);
    variables['target uptime'] = new StreamUptimeVariable(login);
    variables['target stream'] = new StreamVariable(login);
  } else {
    variables.target = new StringVariable(userstate['display-name']);
    variables['target name'] = variables.target;
    variables['target channel'] = new StringVariable(userstate.username);
    variables['target language'] = new ChannelLanguageVariable(userId);
    variables['target game'] = new ChannelGameVariable(userId);
    variables['target title'] = new ChannelTitleVariable(userId);
    variables['target uptime'] = new StreamUptimeVariable(userstate.username);
    variables['target stream'] = new StreamVariable(userstate.username);
  }

  return variables;
}
