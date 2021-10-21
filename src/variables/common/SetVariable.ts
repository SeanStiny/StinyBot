import { Variable } from '..';
import {
  findDictionaryEntry,
  updateDictionaryEntry,
} from '../../models/dictionary';

/**
 * Set a dictionary value.
 */
export class SetVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(args: string[]): Promise<string | undefined> {
    if (args.length > 1) {
      const key = args[1];

      const entry = await findDictionaryEntry(this.channelId, key);
      if (entry) {
        entry.value = args.slice(2).join(' ');
        await updateDictionaryEntry(entry);
      }
      return '';
    }
  }
}
