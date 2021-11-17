import { Variable } from '..';
import { acnh } from '../../acnh';

export class AcnhVillagerNameVariable implements Variable {
  async fetchValue(args: string[]): Promise<string> {
    let value = '';

    const name = args[args.length - 1].toLowerCase();

    if (name) {
      const villager = acnh.villagers[name];
      if (villager) {
        const nameUS = villager.nameUS;
        const nameEU = villager.nameEU;

        value = nameUS;
        if (nameEU !== nameUS) {
          value += ` (EU: ${nameEU})`;
        }
      }
    }

    return value;
  }
}
