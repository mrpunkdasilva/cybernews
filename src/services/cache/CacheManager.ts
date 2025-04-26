interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  storyTTL: number;
  listingTTL: number;
  maxStories: number;
  persistenceKey: string;
}

export const CACHE_CONFIG: CacheConfig = {
  storyTTL: 5 * 60 * 1000,    // 5 minutes
  listingTTL: 2 * 60 * 1000,  // 2 minutes
  maxStories: 500,
  persistenceKey: 'cybernews_cache'
};

export class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheItem<any>>;

  private constructor() {
    this.memoryCache = new Map();
    this.loadFromStorage();
    this.setupCleanupInterval();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(CACHE_CONFIG.persistenceKey);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          this.memoryCache.set(key, value as CacheItem<any>);
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const cacheObject = Object.fromEntries(this.memoryCache.entries());
      localStorage.setItem(CACHE_CONFIG.persistenceKey, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private setupCleanupInterval(): void {
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    let changed = false;

    this.memoryCache.forEach((item, key) => {
      const isStory = key.includes('story_');
      const ttl = isStory ? CACHE_CONFIG.storyTTL : CACHE_CONFIG.listingTTL;
      
      if (now - item.timestamp > ttl) {
        this.memoryCache.delete(key);
        changed = true;
      }
    });

    if (this.memoryCache.size > CACHE_CONFIG.maxStories) {
      const entries = Array.from(this.memoryCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const toRemove = entries.slice(0, this.memoryCache.size - CACHE_CONFIG.maxStories);
      toRemove.forEach(([key]) => this.memoryCache.delete(key));
      changed = true;
    }

    if (changed) {
      this.saveToStorage();
    }
  }

  get<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    const now = Date.now();
    const isStory = key.includes('story_');
    const ttl = isStory ? CACHE_CONFIG.storyTTL : CACHE_CONFIG.listingTTL;

    if (now - item.timestamp > ttl) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.saveToStorage();
  }

  clear(): void {
    this.memoryCache.clear();
    localStorage.removeItem(CACHE_CONFIG.persistenceKey);
  }
}