import { HackerNewsApi } from '@/shared/services/hackerNewsApi';
import { cacheManager } from '@/services/cache/CacheManager';
import type { Story } from '@/services/types/HackerNews';

interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
  parent: number;
  type: 'comment';
}

interface StoryWithComments {
  story: Story;
  comments: Comment[];
}

export class ShowService {
  static async getShowStories(limit: number = 20): Promise<Story[]> {
    const cacheKey = `show_stories_${limit}`;
    
    const cached = await cacheManager.get<Story[]>(cacheKey);
    if (cached) {
      return cached.map(story => ({
        ...story,
        type: story.type || 'story'
      }));
    }

    const ids = await HackerNewsApi.fetchStoryIds('show');
    const stories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, limit));
    
    const processedStories = stories.map(story => ({
      ...story,
      type: story.type || 'story'
    }));

    await cacheManager.set(cacheKey, processedStories);
    
    return processedStories;
  }

  static async getStoryWithComments(id: number): Promise<StoryWithComments> {
    const cacheKey = `show_story_${id}`;
    
    const cached = await cacheManager.get<StoryWithComments>(cacheKey);
    if (cached) {
      return cached;
    }

    const story = await HackerNewsApi.fetchItem<Story>(id);
    if (!story) {
      throw new Error('Story not found');
    }

    const comments = await this.fetchComments(story.kids || []);
    
    const result = {
      story: {
        ...story,
        type: story.type || 'story'
      },
      comments
    };

    await cacheManager.set(cacheKey, result);
    
    return result;
  }

  private static async fetchComments(ids: number[]): Promise<Comment[]> {
    const comments = await Promise.all(
      ids.map(id => HackerNewsApi.fetchItem<Comment>(id))
    );

    return comments
      .filter((comment): comment is Comment => 
        comment !== null && comment.type === 'comment'
      )
      .map(comment => ({
        ...comment,
        type: 'comment' as const
      }));
  }
}