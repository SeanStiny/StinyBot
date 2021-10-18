export { commandVariables } from './command-variables';

export interface Variable {
  fetchValue(): Promise<string | undefined>;
}
