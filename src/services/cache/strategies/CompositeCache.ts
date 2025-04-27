import { CacheStrategy } from './CacheStrategy';

export class CompositeCache implements CacheStrategy {
  private strategies: CacheStrategy[];

  constructor(strategies: CacheStrategy[]) {
    this.strategies = strategies;
  }

  async get<T>(key: string): Promise<T | null> {
    for (const strategy of this.strategies) {
      const value = await strategy.get<T>(key);
      if (value !== null) {
        // Sync value to faster strategies
        this.syncToFasterStrategies(key, value, strategy);
        return value;
      }
    }
    return null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await Promise.all(
      this.strategies.map(strategy => strategy.set(key, value))
    );
  }

  async delete(key: string): Promise<void> {
    await Promise.all(
      this.strategies.map(strategy => strategy.delete(key))
    );
  }

  async clear(): Promise<void> {
    await Promise.all(
      this.strategies.map(strategy => strategy.clear())
    );
  }

  async has(key: string): Promise<boolean> {
    for (const strategy of this.strategies) {
      if (await strategy.has(key)) {
        return true;
      }
    }
    return false;
  }

  private async syncToFasterStrategies<T>(
    key: string, 
    value: T, 
    fromStrategy: CacheStrategy
  ): Promise<void> {
    const strategyIndex = this.strategies.indexOf(fromStrategy);
    if (strategyIndex <= 0) return;

    // Sync to all faster strategies
    const fasterStrategies = this.strategies.slice(0, strategyIndex);
    await Promise.all(
      fasterStrategies.map(strategy => strategy.set(key, value))
    );
  }
}