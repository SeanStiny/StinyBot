/**
 * Reads and consumes characters from a string.
 */
export class StringReader {
  private i: number;

  constructor(private input: string) {
    this.i = -1;
  }

  peek(start: number, end = start): string {
    return this.input.substring(this.i + start, this.i + end + 1);
  }

  consume(k: number): string {
    this.i += k;
    return this.input.charAt(this.i);
  }

  get remaining(): number {
    return this.input.length - this.i - 1;
  }
}
