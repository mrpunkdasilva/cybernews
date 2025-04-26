import { CacheManager } from './cache/CacheManager';
import { HttpClient } from './api/HttpClient';
import type { Story, StoryType, SearchResult } from './types/HackerNews';

class HackerNewsAPI {
  private cache: CacheManager;
  private client: HttpClient;
  private searchClient: HttpClient;

  constructor() {
    this.cache = CacheManager.getInstance();
    this.client = new HttpClient('https://hacker-news.firebaseio.com/v0');
    this.searchClient = new HttpClient('https://hn.algolia.com/api/v1');
  }

  private async fetchStoryById(id: number): Promise<Story | null> {
    const storyCacheKey = `story_${id}`;
    const cachedStory = this.cache.get<Story>(storyCacheKey);
    
    if (cachedStory) {
      return cachedStory;
    }

    try {
      const story = await this.client.get<Story>(`/item/${id}.json`);
      this.cache.set(storyCacheKey, story);
      return story;
    } catch (error) {
      console.error(`Failed to fetch story ${id}:`, error);
      return null;
    }
  }

  async getStories(type: StoryType = 'top', page: number = 1, limit: number = 30): Promise<Story[]> {
    const cacheKey = `listing_${type}_${page}_${limit}`;
    
    try {
      const cachedStories = this.cache.get<Story[]>(cacheKey);
      if (cachedStories) {
        return cachedStories;
      }

      const storyIds = await this.client.get<number[]>(`/${type}stories.json`);
      const start = (page - 1) * limit;
      const end = start + limit;
      const pageStoryIds = storyIds.slice(start, end);

      const stories = await Promise.all(
        pageStoryIds.map(id => this.fetchStoryById(id))
      );

      const validStories = stories.filter((story): story is Story => story !== null);
      this.cache.set(cacheKey, validStories);
      
      return validStories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  async searchStories(query: string): Promise<Story[]> {
    try {
      const result = await this.searchClient.get<SearchResult>(`/search?query=${encodeURIComponent(query)}`);
      
      return result.hits.map(hit => ({
        id: parseInt(hit.objectID),
        title: hit.title,
        url: hit.url,
        score: hit.points,
        by: hit.author,
        time: hit.created_at_i,
        descendants: hit.num_comments,
        type: hit.type,
      }));
    } catch (error) {
      console.error('Error searching stories:', error);
      return [];
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const hackerNewsAPI = new HackerNewsAPI();
