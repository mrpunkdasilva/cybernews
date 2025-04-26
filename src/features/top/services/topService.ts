import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import { cacheManager } from '@/services/cache/CacheManager';
import type { Story } from '@/shared/types/story';

export class TopService {
  static async getTopStories(limit: number = 30): Promise<Story[]> {
    const cacheKey = `top_stories_${limit}`;
    
    // Tenta obter do cache
    const cached = await cacheManager.get<Story[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const ids = await HackerNewsApi.fetchStoryIds('top');
    const stories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
    
    const processedStories = stories
      .map(story => ({
        ...story,
        type: 'story' as const
      }))
      .sort((a, b) => b.score - a.score);

    // Armazena no cache
    await cacheManager.set(cacheKey, processedStories);
    
    return processedStories;
  }
}