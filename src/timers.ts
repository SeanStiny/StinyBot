import { chat } from './chat';
import { logger } from './logger';
import { findActiveChannels } from './models/channel';
import { findTimers } from './models/timer';
import { parseResponse } from './response';
import { twitch } from './twitch';
import { timerVariables } from './variables/timer-variables';

/**
 * Timer module. Handles the scheduling of chat timers.
 */
export const timers = {
  scheduleTick,
};

/**
 * Schedule a timer tick.
 */
function scheduleTick(): void {
  const now = Date.now();
  const delay = 60000 - (now % 60000);

  setTimeout(async () => {
    await tick(now + delay);
    scheduleTick();
  }, delay).unref();
}

/**
 * Look for and trigger timers in active chats.
 */
async function tick(time: number) {
  const activeChannels = await findActiveChannels(60 * 60 * 1000);

  if (activeChannels.length > 0) {
    const channelNames: string[] = [];
    activeChannels.forEach((channel) => {
      channelNames.push(channel.name.substring(1));
    });

    // Find the Twitch ID for each channel owner.
    const activeUsers = await twitch.users(channelNames);
    const channelIds: number[] = [];
    const channelMap: Record<number, string> = {};
    activeUsers.forEach((user) => {
      const channelId = parseInt(user.id);
      channelIds.push(channelId);
      channelMap[channelId] = user.login;
    });

    // Find and trigger active timers if they are due.
    const timers = await findTimers(channelIds);
    timers.forEach(async (timer) => {
      const interval = timer.interval * 60 * 1000;
      const offset = timer.offset * 60 * 1000;
      const isDue = time % interval === offset % interval;

      if (isDue) {
        const channel = channelMap[timer.channelId];

        const vars = timerVariables(channel, timer, time);
        let response;

        try {
          response = await parseResponse(timer.response, vars);
        } catch (reason) {
          logger.error(`Failed to parse timer: ${reason}`);
        }

        if (response && response.length > 0) {
          chat.say(channel, `/me ${response}`);
        }
      }
    });
  }
}
