import { Variable } from '..';
import { findDictionaryEntry } from '../../models/dictionary';

export class DictionaryVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(args: string[]): Promise<string | undefined> {
    if (args.length > 1) {
      const key = args[1];

      const entry = await findDictionaryEntry(this.channelId, key);
      if (entry) {
        return entry.value;
      }
      return '';
    }
  }
}
