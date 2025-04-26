import { BaseCacheStrategy, CacheItem, CacheOptions } from './CacheStrategy';

export class MemoryCacheStrategy extends BaseCacheStrategy {
  private cache: Map<string, CacheItem<any>>;
  private accessLog: Map<string, number>;

  constructor(options: CacheOptions = {}) {
    super(options);
    this.cache = new Map();
    this.accessLog = new Map();
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (this.isExpired(item.timestamp)) {
      await this.delete(key);
      return null;
    }

    // Update access log for LRU
    this.accessLog.set(key, Date.now());
    return item.value;
  }

  async set<T>(key: string, value: T): Promise<void> {
    // Enforce size limits
    if (this.cache.size >= this.options.maxSize!) {
      await this.evictLRU();
    }

    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      expires: Date.now() + (this.options.ttl || 0)
    };

    this.cache.set(key, item);
    this.accessLog.set(key, Date.now());
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.accessLog.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.accessLog.clear();
  }

  async has(key: string): Promise<boolean> {
    const exists = this.cache.has(key);
    if (!exists) return false;

    const item = this.cache.get(key);
    if (this.isExpired(item!.timestamp)) {
      await this.delete(key);
      return false;
    }

    return true;
  }

  private async evictLRU(): Promise<void> {
    if (this.cache.size === 0) return;

    const entries = Array.from(this.accessLog.entries());
    const [lruKey] = entries.sort(([, a], [, b]) => a - b)[0];
    await this.delete(lruKey);
  }
}