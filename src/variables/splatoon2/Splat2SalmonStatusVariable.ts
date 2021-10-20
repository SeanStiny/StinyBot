import { Variable } from '..';
import { findSalmon } from '../../models/splatoon2-salmon';

export class Splat2SalmonStatusVariable implements Variable {
  constructor(private time: number) {}

  async fetchValue(): Promise<string | undefined> {
    const salmon = await findSalmon(this.time);
    if (salmon && salmon.start_time <= this.time) {
      return 'open';
    }
    return 'closed';
  }
}
