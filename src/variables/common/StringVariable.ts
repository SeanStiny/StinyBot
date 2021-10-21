import { Variable } from '..';

/**
 * A variable containing a string value.
 */
export class StringVariable implements Variable {
  constructor(private str: string) {}

  async fetchValue(): Promise<string> {
    return this.str;
  }
}
