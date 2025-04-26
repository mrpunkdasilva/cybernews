import { CacheManager } from './cache/CacheManager';
import { HttpClient } from './api/HttpClient';
import type { Story, StoryType, SearchResult } from './types/HackerNews';

// Re-export types
export type { Story, StoryType, SearchResult };

class HackerNewsAPI {
  private cache: CacheManager;
  private client: HttpClient;
  private algoliaClient: HttpClient;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.cache = CacheManager.getInstance();
    this.client = new HttpClient('https://hacker-news.firebaseio.com/v0');
    this.algoliaClient = new HttpClient('https://hn.algolia.com/api/v1');
  }

  private async fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.fetchWithRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  private async fetchStoryById(id: number): Promise<Story | null> {
    const storyCacheKey = `story_${id}`;
    const cachedStory = this.cache.get<Story>(storyCacheKey);
    
    if (cachedStory) {
      return cachedStory;
    }

    try {
      const story = await this.fetchWithRetry(() => 
        this.client.get<Story>(`/item/${id}.json`)
      );
      
      if (!story) return null;
      
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

      const storyIds = await this.fetchWithRetry(() => 
        this.client.get<number[]>(`/${type}stories.json`)
      );

      if (!storyIds || !storyIds.length) {
        throw new Error('No stories available');
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const pageStoryIds = storyIds.slice(start, end);

      const stories = await Promise.all(
        pageStoryIds.map(id => this.fetchStoryById(id))
      );

      const validStories = stories.filter((story): story is Story => story !== null);
      
      if (validStories.length === 0) {
        throw new Error('Failed to fetch any valid stories');
      }

      this.cache.set(cacheKey, validStories);
      return validStories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch ${type} stories: ${errorMessage}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  async searchStories(query: string): Promise<Story[]> {
    const cacheKey = `search_${query}`;
    const cachedResults = this.cache.get<Story[]>(cacheKey);
    
    if (cachedResults) {
      return cachedResults;
    }

    try {
      const searchResult = await this.fetchWithRetry(() =>
        this.algoliaClient.get<SearchResult>(`/search?query=${encodeURIComponent(query)}`)
      );

      if (!searchResult || !searchResult.hits) {
        throw new Error('No search results available');
      }

      // Converter os resultados do Algolia para o formato Story
      const stories: Story[] = searchResult.hits.map(hit => ({
        id: parseInt(hit.objectID),
        title: hit.title,
        url: hit.url,
        score: hit.points,
        by: hit.author,
        time: hit.created_at_i,
        descendants: hit.num_comments,
        type: 'story'
      }));

      this.cache.set(cacheKey, stories);
      return stories;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Failed to perform search');
    }
  }
}

export const hackerNewsAPI = new HackerNewsAPI();
