import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import type { Story } from '@/services/types/HackerNews';

export class AskService {
  static async getAskStories(limit: number = 30): Promise<Story[]> {
    const ids = await HackerNewsApi.fetchStoryIds('ask');
    const stories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
    
    return stories.map(story => ({
      ...story,
      type: 'story' as const
    }));
  }
}