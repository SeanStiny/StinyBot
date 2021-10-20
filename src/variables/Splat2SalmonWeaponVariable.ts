import { Variable } from '.';
import { findSalmon } from '../models/splatoon2-salmon';

export class Splat2SalmonWeaponVariable implements Variable {
  constructor(private time: number, private index: number) {}

  async fetchValue(): Promise<string | undefined> {
    const salmon = await findSalmon(this.time);
    if (salmon?.weapons) {
      return salmon.weapons[this.index].weapon.name;
    }
  }
}
