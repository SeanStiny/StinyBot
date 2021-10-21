import { Variable } from '..';
import { deleteDictionaryEntry } from '../../models/dictionary';

export class UnsetVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(args: string[]): Promise<string | undefined> {
    if (args.length > 1) {
      const key = args[1];

      await deleteDictionaryEntry(this.channelId, key);
      return '';
    }
  }
}
