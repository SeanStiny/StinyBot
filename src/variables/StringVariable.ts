import { Variable } from '.';

export class StringVariable implements Variable {
  constructor(private str: string) {}

  async fetchValue(): Promise<string> {
    return this.str;
  }
}
