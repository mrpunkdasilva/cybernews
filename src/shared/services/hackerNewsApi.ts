import { cacheManager } from '@/services/cache/CacheManager';
import { Story, StoryType } from '@/shared/types/story';

const API_BASE = 'https://hacker-news.firebaseio.com/v0';

export class HackerNewsApi {
  private static async fetchWithCache<T>(
    endpoint: string,
    ttl?: number
  ): Promise<T> {
    const cacheKey = `hn_${endpoint}`;
    
    // Tenta obter do cache primeiro
    const cached = await cacheManager.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, busca da API
    const response = await fetch(`${API_BASE}/${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Armazena no cache
    await cacheManager.set(cacheKey, data);
    
    return data;
  }

  static async fetchStoryIds(type: StoryType): Promise<number[]> {
    return this.fetchWithCache<number[]>(`${type}stories`);
  }

  static async fetchItem<T>(id: number): Promise<T> {
    return this.fetchWithCache<T>(`item/${id}`);
  }

  static async fetchItems<T>(ids: number[]): Promise<T[]> {
    const promises = ids.map(id => this.fetchItem<T>(id));
    return Promise.all(promises);
  }

  static async searchStories(query: string): Promise<Story[]> {
    const cacheKey = `hn_search_${query}`;
    
    const cached = await cacheManager.get<Story[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Implementar lógica de busca aqui
    // Por enquanto, retorna top stories filtradas
    const topStories = await this.fetchStoryIds('top');
    const stories = await this.fetchItems<Story>(topStories.slice(0, 30));
    
    const filtered = stories.filter(story => 
      story.title?.toLowerCase().includes(query.toLowerCase())
    );

    await cacheManager.set(cacheKey, filtered);
    return filtered;
  }
}