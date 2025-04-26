export interface CacheStrategy {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

export interface CacheOptions {
  ttl?: number;          // Time-to-live in milliseconds
  maxSize?: number;      // Maximum number of items
  namespace?: string;    // Cache namespace for isolation
  persistent?: boolean;  // Whether to persist cache
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  expires: number;
}

export abstract class BaseCacheStrategy implements CacheStrategy {
  protected options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: 5 * 60 * 1000,    // 5 minutes default
      maxSize: 500,          // 500 items default
      namespace: 'cybernews',
      persistent: true,
      ...options
    };
  }

  protected isExpired(timestamp: number): boolean {
    if (this.options.ttl === 0) return false;
    return Date.now() - timestamp > this.options.ttl;
  }

  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract has(key: string): Promise<boolean>;
}