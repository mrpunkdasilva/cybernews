import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import { cacheManager } from '@/services/cache/CacheManager';
import type { Story } from '@/shared/types/story';

export class AskService {
  static async getAskStories(limit: number = 30): Promise<Story[]> {
    const cacheKey = `ask_stories_${limit}`;
    
    const cached = await cacheManager.get<Story[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const ids = await HackerNewsApi.fetchStoryIds('ask');
    const stories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
    
    const processedStories = stories.map(story => ({
      ...story,
      type: 'story' as const
    }));

    await cacheManager.set(cacheKey, processedStories);
    
    return processedStories;
  }
}