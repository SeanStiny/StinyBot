import { AdminAction } from '.';
import { chat } from '../chat';
import { deleteChannel } from '../models/channel';

/**
 * Leave a channel.
 */
export const leaveAction: AdminAction = async (args) => {
  if (args.length > 1) {
    const channelName = args[1];

    try {
      await chat.part(channelName);
      await deleteChannel(channelName);
      return `Sucessfully left ${channelName}.`;
    } catch (reason) {
      return `Unable to leave channel ${channelName}: ${reason}`;
    }
  }
  return 'You must provide a channel to leave.';
};
