import { Variable } from '..';
import { findRotation } from '../../models/splatoon2-rotation';

export class Splat2StageVariable implements Variable {
  constructor(
    private mode: 'league' | 'ranked' | 'turf',
    private time: number,
    private stage: 'a' | 'b'
  ) {}

  async fetchValue(): Promise<string | undefined> {
    const rotation = await findRotation(this.time, this.mode);
    if (this.stage === 'a') {
      return rotation?.stage_a.name;
    }
    return rotation?.stage_b.name;
  }
}
