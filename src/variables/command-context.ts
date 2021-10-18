import { ChatUserstate } from 'tmi.js';
import { twitch } from '../twitch';
import { VariableCollection } from './variable-context';

export function createCommandContext(
  channel: string,
  userstate: ChatUserstate,
  message: string
): VariableCollection {
  const variables = new VariableCollection();
  const channelId = parseInt(userstate['room-id'] || '-1');
  const args = message.split(' ');

  // Channel information variables.
  variables.setValueOf('channel', channel.substring(1));

  variables.attachLoader('name', async () => {
    return (await twitch.channel(channelId)).broadcaster_name;
  });

  variables.attachLoader('language', async () => {
    return (await twitch.channel(channelId)).broadcaster_language;
  });

  variables.attachLoader('game', async () => {
    return (await twitch.channel(channelId)).game_name;
  });

  variables.attachLoader('title', async () => {
    return (await twitch.channel(channelId)).title;
  });

  // Argument variables.
  args.slice(1).forEach((arg, index) => {
    variables.setValueOf((index + 1).toString(), arg);
  });

  // Command text variable
  variables.setValueOf('text', message.substring(args[0].length));

  return variables;
}
