import { Variable } from '..';
import { findSalmon } from '../../models/splatoon2-salmon';

/**
 * A variable containing one of the current Grizzco weapons.
 */
export class Splat2SalmonWeaponVariable implements Variable {
  constructor(private time: number, private index: number) {}

  async fetchValue(): Promise<string | undefined> {
    const salmon = await findSalmon(this.time);
    if (salmon?.weapons) {
      const weapon = salmon.weapons[this.index];
      if (weapon.weapon) {
        return weapon.weapon.name;
      } else if (weapon.coop_special_weapon) {
        return '?';
      }
    }
  }
}
