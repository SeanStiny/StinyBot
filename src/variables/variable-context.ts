/**
 * A collection of variable values and loaders. Once a variable has been
 * loaded, the value is stored indefinitely.
 */
export class VariableCollection {
  private values: Record<string, string | undefined>;
  private loaders: Record<string, () => Promise<string | undefined>>;

  constructor() {
    this.values = {};
    this.loaders = {};
  }

  /**
   * @param key The key of the variable to look up the value for.
   * @returns The value of the variable.
   */
  async valueOf(key: string): Promise<string | undefined> {
    let value = this.values[key];
    const loader = this.loaders[key];

    if (value === undefined && loader !== undefined) {
      value = await loader();
      if (value !== undefined) {
        this.values[key] = value;
      }
    }

    return value;
  }

  /**
   * @param identifier The identifier of the variable to set the value of.
   * @param value The new value for the variable.
   */
  setValueOf(identifier: string, value: string): void {
    this.values[identifier] = value;
  }

  /**
   * Loaders are called if the variable has no value yet.
   * @param identifier The identifier of the variable to attach the loader to.
   * @param loader The function that loads the value of the variable.
   */
  attachLoader(
    identifier: string,
    loader: () => Promise<string | undefined>
  ): void {
    this.loaders[identifier] = loader;
  }
}

export interface VariableProps {
  channelId: number;
  channelLogin: string;
  message?: string;
  userId?: number;
  targetId?: number;
}
