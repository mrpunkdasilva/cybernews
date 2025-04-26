import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import type { Story, Comment } from '@/shared/types/story';

export class ShowService {
  static async getShowStories(limit: number = 20): Promise<Story[]> {
    const ids = await HackerNewsApi.fetchStoryIds('show');
    return HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
  }

  static async getStoryWithComments(id: number): Promise<{
    story: Story;
    comments: Comment[];
  }> {
    const story = await HackerNewsApi.fetchItem<Story>(id);
    const comments = story.kids 
      ? await HackerNewsApi.fetchItems<Comment>(story.kids.slice(0, 10))
      : [];
    
    return { story, comments };
  }
}