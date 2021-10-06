import { Command } from '../command';

/**
 * Responds in chat.
 */
export class RespondCommand implements Command {
  constructor(
    public channelId: number,
    public trigger: string,
    public action: RespondOptions,
    public opts?: {
      isModOnly?: boolean;
      isVipOnly?: boolean;
      isSubOnly?: boolean;
      cooldown?: number;
    }
  ) {}
}

export interface RespondOptions {
  kind: 'respond';
  response: string;
}
