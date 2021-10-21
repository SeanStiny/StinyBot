export { commandVariables } from './command-variables';

export interface Variable {
  fetchValue(args: string[]): Promise<string | undefined>;
}
