import { Variable } from '..';
import { findVillager } from '../../models/villager';

export class AcnhVillagerNameVariable implements Variable {
  async fetchValue(args: string[]): Promise<string> {
    let value = '';

    const name = args[args.length - 1];

    if (name) {
      const villager = await findVillager(name);
      if (villager) {
        const usName = villager.name['name-USen'];
        const euName = villager.name['name-EUen'];

        value = usName;
        if (euName !== usName) {
          value += ` (EU: ${euName})`;
        }
      }
    }

    return value;
  }
}
