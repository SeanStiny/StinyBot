import { ChatUserstate } from 'tmi.js';
import { Variable } from '.';
import { ChannelGameVariable } from './twitch/ChannelGameVariable';
import { ChannelLanguageVariable } from './twitch/ChannelLanguageVariable';
import { ChannelNameVariable } from './twitch/ChannelNameVariable';
import { ChannelTitleVariable } from './twitch/ChannelTitleVariable';
import { Splat2ModeVariable } from './splatoon2/Splat2ModeVariable';
import { Splat2SalmonStageVariable } from './splatoon2/Splat2SalmonStageVariable';
import { Splat2SalmonStatusVariable } from './splatoon2/Splat2SalmonStatusVariable';
import { Splat2SalmonTimeVariable } from './splatoon2/Splat2SalmonTimeVariable';
import { Splat2SalmonWeaponVariable } from './splatoon2/Splat2SalmonWeaponVariable';
import { Splat2StageVariable } from './splatoon2/Splat2StageVariable';
import { StreamUptimeVariable } from './twitch/StreamUptimeVariable';
import { StreamVariable } from './twitch/StreamVariable';
import { StringVariable } from './common/StringVariable';
import { UserGameVariable } from './twitch/UserGameVariable';
import { UserLanguageVariable } from './twitch/UserLanguageVariable';
import { UserLoginVariable } from './twitch/UserLoginVariable';
import { UserNameVariable } from './twitch/UserNameVariable';
import { UserTitleVariable } from './twitch/UserTitleVariable';
import { LookupVariable } from './common/LookupVariable';
import { SetVariable } from './common/SetVariable';
import { UnsetVariable } from './common/UnsetVariable';
import { CountVariable } from './common/CountVariable';
import { UserFollowAgeVariable } from './twitch/UserFollowAgeVariable';
import { TargetFollowAgeVariable } from './twitch/TargetFollowAgeVariable';

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
  const vars: Record<string, Variable> = {};
  const channelId = parseInt(userstate['room-id']);
  const userId = parseInt(userstate['user-id']);
  const args = message.split(' ');
  const now = Date.now();

  // Argument variables.
  args.slice(1).forEach((arg, index) => {
    vars[index + 1] = new StringVariable(arg);
  });

  // Channel information variables.
  vars.channel = new StringVariable(channel);
  vars.name = new ChannelNameVariable(channelId);
  vars.language = new ChannelLanguageVariable(channelId);
  vars.game = new ChannelGameVariable(channelId);
  vars.title = new ChannelTitleVariable(channelId);

  // Command text variable
  vars.text = new StringVariable(message.substring(args[0].length));

  // Stream information variables
  vars.stream = new StreamVariable(channel);
  vars.uptime = new StreamUptimeVariable(channel);

  // Command user variables
  vars.user = new StringVariable(userstate['display-name']);
  vars['user followage'] = new UserFollowAgeVariable(userId, channelId);

  // Target variables
  if (args.length > 1) {
    const login = args[1];
    vars.target = new UserNameVariable(login);
    vars['target name'] = vars.target;
    vars['target channel'] = new UserLoginVariable(login);
    vars['target language'] = new UserLanguageVariable(login);
    vars['target game'] = new UserGameVariable(login);
    vars['target title'] = new UserTitleVariable(login);
    vars['target uptime'] = new StreamUptimeVariable(login);
    vars['target stream'] = new StreamVariable(login);
    vars['target followage'] = new TargetFollowAgeVariable(login, channelId);
  } else {
    vars.target = new StringVariable(userstate['display-name']);
    vars['target name'] = vars.target;
    vars['target channel'] = new StringVariable(userstate.username);
    vars['target language'] = new ChannelLanguageVariable(userId);
    vars['target game'] = new ChannelGameVariable(userId);
    vars['target title'] = new ChannelTitleVariable(userId);
    vars['target uptime'] = new StreamUptimeVariable(userstate.username);
    vars['target stream'] = new StreamVariable(userstate.username);
    vars['target followage'] = new UserFollowAgeVariable(userId, channelId);
  }

  // Dictionary variables
  vars['lookup'] = new LookupVariable(channelId);
  vars['set'] = new SetVariable(channelId);
  vars['unset'] = new UnsetVariable(channelId);
  vars['count'] = new CountVariable(channelId);

  // Splatoon 2 variables
  vars['ranked mode'] = new Splat2ModeVariable('ranked', now);
  vars['ranked stagea'] = new Splat2StageVariable('ranked', now, 'a');
  vars['ranked stageb'] = new Splat2StageVariable('ranked', now, 'b');
  vars['league mode'] = new Splat2ModeVariable('league', now);
  vars['league stagea'] = new Splat2StageVariable('league', now, 'a');
  vars['league stageb'] = new Splat2StageVariable('league', now, 'b');
  vars['turf stagea'] = new Splat2StageVariable('turf', now, 'a');
  vars['turf stageb'] = new Splat2StageVariable('turf', now, 'b');
  for (let i = 0; i < 24; i++) {
    const time = now + i * 3600000;
    vars[`ranked mode ${i}`] = new Splat2ModeVariable('ranked', time);
    vars[`ranked stagea ${i}`] = new Splat2StageVariable('ranked', time, 'a');
    vars[`ranked stageb ${i}`] = new Splat2StageVariable('ranked', time, 'b');
    vars[`league mode ${i}`] = new Splat2ModeVariable('league', time);
    vars[`league stagea ${i}`] = new Splat2StageVariable('league', time, 'a');
    vars[`league stageb ${i}`] = new Splat2StageVariable('league', time, 'b');
    vars[`turf stagea ${i}`] = new Splat2StageVariable('turf', time, 'a');
    vars[`turf stageb ${i}`] = new Splat2StageVariable('turf', time, 'b');
  }
  vars['salmon'] = new Splat2SalmonStatusVariable(now);
  vars['salmon weapona'] = new Splat2SalmonWeaponVariable(now, 0);
  vars['salmon weaponb'] = new Splat2SalmonWeaponVariable(now, 1);
  vars['salmon weaponc'] = new Splat2SalmonWeaponVariable(now, 2);
  vars['salmon weapond'] = new Splat2SalmonWeaponVariable(now, 3);
  vars['salmon stage'] = new Splat2SalmonStageVariable(now);
  vars['salmon time'] = new Splat2SalmonTimeVariable(now);

  return vars;
}
