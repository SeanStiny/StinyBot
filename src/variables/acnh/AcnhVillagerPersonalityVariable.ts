import { Variable } from '..';
import { findVillager } from '../../models/villager';

export class AcnhVillagerPersonalityVariable implements Variable {
  async fetchValue(args: string[]): Promise<string> {
    let value = '';

    const name = args[args.length - 1];

    if (name) {
      const villager = await findVillager(name);
      if (villager) {
        value = villager.personality.toLowerCase();
      }
    }

    return value;
  }
}
