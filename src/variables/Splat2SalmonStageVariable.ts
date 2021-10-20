import { Variable } from '.';
import { findSalmon } from '../models/splatoon2-salmon';

export class Splat2SalmonStageVariable implements Variable {
  constructor(private time: number) {}

  async fetchValue(): Promise<string | undefined> {
    const salmon = await findSalmon(this.time);
    return salmon?.stage?.name;
  }
}
