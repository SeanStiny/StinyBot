/**
 * Reads and consumes characters from a string.
 */
export class StringReader {
  private i: number;

  constructor(private input: string) {
    this.i = -1;
  }

  peek(k: number): string {
    return this.input.charAt(this.i + k);
  }

  consume(k: number): string {
    this.i += k;
    return this.input.charAt(this.i);
  }

  get remaining(): number {
    return this.input.length - this.i - 1;
  }
}
