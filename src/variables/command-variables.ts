import { ChatUserstate } from 'tmi.js';
import { Variable } from '.';
import { ChannelGameVariable } from './ChannelGameVariable';
import { ChannelLanguageVariable } from './ChannelLanguageVariable';
import { ChannelNameVariable } from './ChannelNameVariable';
import { ChannelTitleVariable } from './ChannelTitleVariable';
import { Splat2ModeVariable } from './Splat2ModeVariable';
import { Splat2SalmonStageVariable } from './Splat2SalmonStageVariable';
import { Splat2SalmonStatusVariable } from './Splat2SalmonStatusVariable';
import { Splat2SalmonTimeVariable } from './Splat2SalmonTimeVariable';
import { Splat2SalmonWeaponVariable } from './Splat2SalmonWeaponVariable';
import { Splat2StageVariable } from './Splat2StageVariable';
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
  } else {
    vars.target = new StringVariable(userstate['display-name']);
    vars['target name'] = vars.target;
    vars['target channel'] = new StringVariable(userstate.username);
    vars['target language'] = new ChannelLanguageVariable(userId);
    vars['target game'] = new ChannelGameVariable(userId);
    vars['target title'] = new ChannelTitleVariable(userId);
    vars['target uptime'] = new StreamUptimeVariable(userstate.username);
    vars['target stream'] = new StreamVariable(userstate.username);
  }

  // Splatoon 2 variables
  const nextRot = now + 7200000;
  vars['ranked mode'] = new Splat2ModeVariable('ranked', now);
  vars['ranked stagea'] = new Splat2StageVariable('ranked', now, 'a');
  vars['ranked stageb'] = new Splat2StageVariable('ranked', now, 'b');
  vars['league mode'] = new Splat2ModeVariable('league', now);
  vars['league stagea'] = new Splat2StageVariable('league', now, 'a');
  vars['league stageb'] = new Splat2StageVariable('league', now, 'b');
  vars['turf stagea'] = new Splat2StageVariable('turf', now, 'a');
  vars['turf stageb'] = new Splat2StageVariable('turf', now, 'b');
  vars['next ranked mode'] = new Splat2ModeVariable('ranked', nextRot);
  vars['next ranked stagea'] = new Splat2StageVariable('ranked', nextRot, 'a');
  vars['next ranked stageb'] = new Splat2StageVariable('ranked', nextRot, 'b');
  vars['next league mode'] = new Splat2ModeVariable('league', nextRot);
  vars['next league stagea'] = new Splat2StageVariable('league', nextRot, 'a');
  vars['next league stageb'] = new Splat2StageVariable('league', nextRot, 'b');
  vars['next turf stagea'] = new Splat2StageVariable('turf', nextRot, 'a');
  vars['next turf stageb'] = new Splat2StageVariable('turf', nextRot, 'b');
  vars['salmon'] = new Splat2SalmonStatusVariable(now);
  vars['salmon weapona'] = new Splat2SalmonWeaponVariable(now, 0);
  vars['salmon weaponb'] = new Splat2SalmonWeaponVariable(now, 1);
  vars['salmon weaponc'] = new Splat2SalmonWeaponVariable(now, 2);
  vars['salmon weapond'] = new Splat2SalmonWeaponVariable(now, 3);
  vars['salmon stage'] = new Splat2SalmonStageVariable(now);
  vars['salmon time'] = new Splat2SalmonTimeVariable(now);

  return vars;
}
