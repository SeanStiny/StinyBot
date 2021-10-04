import { Command } from '.';
import { chat } from '../chat';
import { Channel, insertChannel } from '../models/channel';

/**
 * Join a channel.
 */
export const joinCommand: Command = {
  isModOnly: true,

  execute: async (args) => {
    if (args.length > 1) {
      const channelName = args[1];

      try {
        await chat.join(channelName);
        const channel = new Channel(channelName);
        await insertChannel(channel);
        return `Sucessfully joined ${channelName}.`;
      } catch (reason) {
        return `Unable to join channel ${channelName}: ${reason}`;
      }
    }
    return 'You must provide a channel to join.';
  },
};
