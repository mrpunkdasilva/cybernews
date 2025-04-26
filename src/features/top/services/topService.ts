import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import type { Story } from '@/services/types/HackerNews';

export class TopService {
  static async getTopStories(limit: number = 30): Promise<Story[]> {
    const ids = await HackerNewsApi.fetchStoryIds('top');
    const stories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
    
    return stories
      .map(story => ({
        ...story,
        type: 'story' as const
      }))
      .sort((a, b) => b.score - a.score); // Ordenação descendente por pontos
  }
}