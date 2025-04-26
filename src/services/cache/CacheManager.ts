export interface CacheOptions {
  ttl: number;
  namespace?: string;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { value: any; expiry: number }>;
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, value: T, options?: Partial<CacheOptions>): void {
    const ttl = options?.ttl || this.defaultTTL;
    const namespace = options?.namespace;
    const finalKey = namespace ? `${namespace}:${key}` : key;
    const expiry = Date.now() + ttl;
    
    this.cache.set(finalKey, { value, expiry });
  }

  get<T>(key: string, namespace?: string): T | null {
    const finalKey = namespace ? `${namespace}:${key}` : key;
    const item = this.cache.get(finalKey);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(finalKey);
      return null;
    }
    
    return item.value as T;
  }

  delete(key: string, namespace?: string): void {
    const finalKey = namespace ? `${namespace}:${key}` : key;
    this.cache.delete(finalKey);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheManager = CacheManager.getInstance();