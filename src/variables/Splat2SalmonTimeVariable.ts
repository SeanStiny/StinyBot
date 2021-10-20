import { Variable } from '.';
import { findSalmon } from '../models/splatoon2-salmon';

export class Splat2SalmonTimeVariable implements Variable {
  constructor(private time: number) {}

  async fetchValue(): Promise<string | undefined> {
    const salmon = await findSalmon(this.time);
    if (salmon) {
      let totalMs: number;

      if (salmon.start_time <= this.time) {
        totalMs = salmon.end_time * 1000 - this.time;
      } else {
        totalMs = this.time - salmon.start_time * 1000;
      }

      const totalMinutes = Math.floor(totalMs / 1000 / 60);
      const totalHours = Math.floor(totalMinutes / 60);

      const hours = totalHours;
      const minutes = totalMinutes % 60;

      let remaining = '';
      if (hours > 0) {
        remaining += `${hours} hours, `;
      }
      remaining += `${minutes} minutes`;

      return remaining;
    }
  }
}
