import { Variable } from '.';
import { findRotation } from '../models/splatoon2-rotation';

export class Splat2ModeVariable implements Variable {
  constructor(
    private mode: 'league' | 'ranked' | 'turf',
    private time: number
  ) {}

  async fetchValue(): Promise<string | undefined> {
    const rotation = await findRotation(this.time, this.mode);
    return rotation?.rule.name;
  }
}
