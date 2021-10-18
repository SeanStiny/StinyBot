export interface Variable {
  fetchValue(): Promise<string | undefined>;
}
