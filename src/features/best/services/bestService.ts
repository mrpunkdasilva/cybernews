import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import type { Story } from '@/services/types/HackerNews';

export class BestService {
  static async getBestStories(limit: number = 20): Promise<Story[]> {
    const ids = await HackerNewsApi.fetchStoryIds('best');
    const stories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
    
    // Garantindo que todas as stories têm o campo type
    return stories.map(story => ({
      ...story,
      type: 'story' as const
    }));
  }
}