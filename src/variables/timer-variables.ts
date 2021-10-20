import { Variable } from '.';
import { Timer } from '../models/timer';
import { StringVariable } from './common/StringVariable';
import { Splat2ModeVariable } from './splatoon2/Splat2ModeVariable';
import { Splat2SalmonStageVariable } from './splatoon2/Splat2SalmonStageVariable';
import { Splat2SalmonStatusVariable } from './splatoon2/Splat2SalmonStatusVariable';
import { Splat2SalmonTimeVariable } from './splatoon2/Splat2SalmonTimeVariable';
import { Splat2SalmonWeaponVariable } from './splatoon2/Splat2SalmonWeaponVariable';
import { Splat2StageVariable } from './splatoon2/Splat2StageVariable';
import { ChannelGameVariable } from './twitch/ChannelGameVariable';
import { ChannelLanguageVariable } from './twitch/ChannelLanguageVariable';
import { ChannelNameVariable } from './twitch/ChannelNameVariable';
import { ChannelTitleVariable } from './twitch/ChannelTitleVariable';
import { StreamUptimeVariable } from './twitch/StreamUptimeVariable';
import { StreamVariable } from './twitch/StreamVariable';

export function timerVariables(
  channel: string,
  timer: Timer,
  time: number
): Record<string, Variable> {
  // Timer context.
  const vars: Record<string, Variable> = {};

  // Channel information variables.
  vars.channel = new StringVariable(channel);
  vars.name = new ChannelNameVariable(timer.channelId);
  vars.language = new ChannelLanguageVariable(timer.channelId);
  vars.game = new ChannelGameVariable(timer.channelId);
  vars.title = new ChannelTitleVariable(timer.channelId);

  // Stream information variables
  vars.stream = new StreamVariable(channel);
  vars.uptime = new StreamUptimeVariable(channel);

  // Splatoon 2 variables
  vars['ranked mode'] = new Splat2ModeVariable('ranked', time);
  vars['ranked stagea'] = new Splat2StageVariable('ranked', time, 'a');
  vars['ranked stageb'] = new Splat2StageVariable('ranked', time, 'b');
  vars['league mode'] = new Splat2ModeVariable('league', time);
  vars['league stagea'] = new Splat2StageVariable('league', time, 'a');
  vars['league stageb'] = new Splat2StageVariable('league', time, 'b');
  vars['turf stagea'] = new Splat2StageVariable('turf', time, 'a');
  vars['turf stageb'] = new Splat2StageVariable('turf', time, 'b');
  for (let i = 0; i < 24; i++) {
    const when = time + i * 3600000;
    vars[`ranked mode ${i}`] = new Splat2ModeVariable('ranked', when);
    vars[`ranked stagea ${i}`] = new Splat2StageVariable('ranked', when, 'a');
    vars[`ranked stageb ${i}`] = new Splat2StageVariable('ranked', when, 'b');
    vars[`league mode ${i}`] = new Splat2ModeVariable('league', when);
    vars[`league stagea ${i}`] = new Splat2StageVariable('league', when, 'a');
    vars[`league stageb ${i}`] = new Splat2StageVariable('league', when, 'b');
    vars[`turf stagea ${i}`] = new Splat2StageVariable('turf', when, 'a');
    vars[`turf stageb ${i}`] = new Splat2StageVariable('turf', when, 'b');
  }
  vars['salmon'] = new Splat2SalmonStatusVariable(time);
  vars['salmon weapona'] = new Splat2SalmonWeaponVariable(time, 0);
  vars['salmon weaponb'] = new Splat2SalmonWeaponVariable(time, 1);
  vars['salmon weaponc'] = new Splat2SalmonWeaponVariable(time, 2);
  vars['salmon weapond'] = new Splat2SalmonWeaponVariable(time, 3);
  vars['salmon stage'] = new Splat2SalmonStageVariable(time);
  vars['salmon time'] = new Splat2SalmonTimeVariable(time);

  return vars;
}
