import { Variable } from '..';
import {
  DictionaryEntry,
  findDictionaryEntry,
  updateDictionaryEntry,
} from '../../models/dictionary';

/**
 * Increments a dictionary value.
 */
export class CountVariable implements Variable {
  constructor(private channelId: number) {}

  async fetchValue(args: string[]): Promise<'' | undefined> {
    let response: '' | undefined;

    let alias = args[1];
    if (alias) {
      alias = alias.toLowerCase();
      const amountStr = args[2];

      // Increment by a custom amount.
      let amount: number;
      if (amountStr && !isNaN(Number(amountStr))) {
        amount = parseFloat(amountStr);
      } else {
        amount = 1;
      }

      // Update an existing entry or create a new one starting from 0.
      let entry = await findDictionaryEntry(this.channelId, alias);
      if (entry) {
        if (!isNaN(Number(entry.value))) {
          const oldAmount = parseFloat(entry.value);
          entry.value = (oldAmount + amount).toString();
        } else {
          entry.value = amount.toString();
        }
      } else {
        entry = new DictionaryEntry(this.channelId, alias, amount.toString());
      }
      await updateDictionaryEntry(entry);

      response = '';
    }

    return response;
  }
}
