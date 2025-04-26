import { BaseCacheStrategy, CacheItem, CacheOptions } from './CacheStrategy';

export class IndexedDBStrategy extends BaseCacheStrategy {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(options: CacheOptions = {}) {
    super(options);
    this.dbName = `${this.options.namespace}_cache`;
    this.storeName = 'cache_store';
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  private async transaction(
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    const db = await this.getDB();
    const transaction = db.transaction(this.storeName, mode);
    return transaction.objectStore(this.storeName);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const store = await this.transaction();
      const request = store.get(key);

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const item = request.result as CacheItem<T> | undefined;
          
          if (!item) {
            resolve(null);
            return;
          }

          if (this.isExpired(item.timestamp)) {
            this.delete(key).then(() => resolve(null));
            return;
          }

          resolve(item.value);
        };
      });
    } catch (error) {
      console.warn(`IndexedDBStrategy: Error reading key ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const store = await this.transaction('readwrite');
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        expires: Date.now() + this.options.ttl
      };

      return new Promise((resolve, reject) => {
        const request = store.put(item, key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn(`IndexedDBStrategy: Error setting key ${key}`, error);
      await this.clearExpired();
    }
  }

  async delete(key: string): Promise<void> {
    const store = await this.transaction('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    const store = await this.transaction('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async has(key: string): Promise<boolean> {
    const store = await this.transaction();
    return new Promise((resolve, reject) => {
      const request = store.count(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result > 0);
    });
  }

  private async clearExpired(): Promise<void> {
    const store = await this.transaction('readwrite');
    const request = store.openCursor();

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;

      const item = cursor.value as CacheItem<unknown>;
      if (this.isExpired(item.timestamp)) {
        cursor.delete();
      }
      cursor.continue();
    };
  }
}