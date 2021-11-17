import { Variable } from '..';
import { acnh } from '../../acnh';

export class AcnhVillagerBirthdayVariable implements Variable {
  async fetchValue(args: string[]): Promise<string> {
    let value = '';

    const name = args[args.length - 1].toLowerCase();

    if (name) {
      const villager = acnh.villagers[name];
      if (villager) {
        value = villager.birthday;
      }
    }

    return value;
  }
}
