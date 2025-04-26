import { BaseCacheStrategy, CacheItem, CacheOptions } from './CacheStrategy';

interface StorageError extends Error {
  name: string;
}

export class LocalStorageStrategy extends BaseCacheStrategy {
  private prefix: string;

  constructor(options: CacheOptions = {}) {
    super(options);
    this.prefix = `${this.options.namespace}:`;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const data = localStorage.getItem(fullKey);
      if (!data) return null;

      const item: CacheItem<T> = JSON.parse(data);
      
      if (this.isExpired(item.timestamp)) {
        await this.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      const err = error as Error;
      console.warn(`LocalStorageStrategy: Error reading key ${key}`, err.message);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        expires: Date.now() + (this.options.ttl || 0)
      };

      localStorage.setItem(fullKey, JSON.stringify(item));
    } catch (error) {
      const err = error as StorageError;
      console.warn(`LocalStorageStrategy: Error setting key ${key}`, err.message);
      // If storage is full, clear old items
      if (err.name === 'QuotaExceededError') {
        await this.clearExpired();
      }
    }
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);
    localStorage.removeItem(fullKey);
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage);
    keys
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  async has(key: string): Promise<boolean> {
    const fullKey = this.getFullKey(key);
    const exists = localStorage.getItem(fullKey) !== null;
    if (!exists) return false;

    const item = await this.get(key);
    return item !== null;
  }

  private async clearExpired(): Promise<void> {
    const keys = Object.keys(localStorage);

    for (const key of keys) {
      if (!key.startsWith(this.prefix)) continue;

      try {
        const data = localStorage.getItem(key);
        if (!data) continue;

        const item: CacheItem<any> = JSON.parse(data);
        if (this.isExpired(item.timestamp)) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        const err = error as Error;
        console.warn(`LocalStorageStrategy: Error clearing key ${key}`, err.message);
      }
    }
  }
}