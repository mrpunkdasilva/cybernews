import { CacheManager } from './cache/CacheManager';
import { HttpClient } from './api/HttpClient';
import type { Story, StoryType, SearchResult, ItemType } from './types/HackerNews';

// Re-export types
export type { Story, StoryType, SearchResult, ItemType };

export class HackerNewsAPI {
  private readonly cache: CacheManager;
  private readonly client: HttpClient;
  private readonly algoliaClient: HttpClient;
  private readonly storyTTL = 5 * 60 * 1000;    // 5 minutes
  private readonly listingTTL = 2 * 60 * 1000;  // 2 minutes
  private readonly searchTTL = 2 * 60 * 1000;   // 2 minutes

  constructor() {
    this.cache = CacheManager.getInstance();
    this.client = new HttpClient('https://hacker-news.firebaseio.com/v0');
    this.algoliaClient = new HttpClient('https://hn.algolia.com/api/v1');
  }

  private async fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (i === retries - 1) break;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    throw lastError || new Error('Failed after multiple retries');
  }

  async getStories(type: StoryType = 'top', page: number = 1): Promise<Story[]> {
    const limit = 20;
    const cacheKey = `listing_${type}_${page}`;
    
    try {
      const cachedStories = this.cache.get<Story[]>(cacheKey);
      if (cachedStories) {
        return cachedStories;
      }

      const storyIds = await this.fetchWithRetry(() => 
        this.client.get<number[]>(`/${type}stories.json`)
      );

      if (!storyIds?.length) {
        throw new Error('No stories available');
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const pageStoryIds = storyIds.slice(start, end);

      const stories = await this.fetchStoriesInBatches(pageStoryIds);
      
      if (stories.length === 0) {
        throw new Error('Failed to fetch any valid stories');
      }

      const sortedStories = stories.sort((a, b) => (b.score || 0) - (a.score || 0));
      this.cache.set(cacheKey, sortedStories, { ttl: this.listingTTL });
      
      return sortedStories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch ${type} stories: ${errorMessage}`);
    }
  }

  private async fetchStoriesInBatches(storyIds: number[]): Promise<Story[]> {
    const stories: Story[] = [];
    const batchSize = 5;
    
    for (let i = 0; i < storyIds.length; i += batchSize) {
      const batch = storyIds.slice(i, i + batchSize);
      const batchStories = await Promise.all(
        batch.map(id => this.getStory(id))
      );
      
      stories.push(...batchStories.filter((story): story is Story => story !== null));
    }
    
    return stories;
  }

  async getStory(id: number): Promise<Story | null> {
    const cacheKey = `story_${id}`;
    
    try {
      const cachedStory = this.cache.get<Story>(cacheKey);
      if (cachedStory) {
        return cachedStory;
      }

      const item = await this.fetchWithRetry(() =>
        this.client.get<Story>(`/item/${id}.json`)
      );

      if (!item || !this.isValidStory(item)) {
        return null;
      }

      this.cache.set(cacheKey, item, { ttl: this.storyTTL });
      return item;
    } catch (error) {
      console.error(`Failed to fetch story ${id}:`, error);
      return null;
    }
  }

  private isValidStory(item: any): item is Story {
    return (
      item &&
      typeof item.id === 'number' &&
      typeof item.title === 'string' &&
      typeof item.by === 'string' &&
      typeof item.time === 'number' &&
      (item.type === 'story' || item.type === 'job')
    );
  }

  clearCache(): void {
    this.cache.clear();
  }

  async searchStories(query: string): Promise<Story[]> {
    const cacheKey = `search_${query}`;
    
    try {
      const cachedResults = this.cache.get<Story[]>(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }

      const searchResult = await this.fetchWithRetry(() =>
        this.algoliaClient.get<SearchResult>(`/search?query=${encodeURIComponent(query)}`)
      );

      if (!searchResult?.hits?.length) {
        return [];
      }

      const stories: Story[] = searchResult.hits.map(hit => ({
        id: parseInt(hit.objectID),
        title: hit.title || 'Untitled',
        url: hit.url || '',
        score: hit.points || 0,
        by: hit.author || 'anonymous',
        time: hit.created_at_i || Math.floor(Date.now() / 1000),
        descendants: hit.num_comments || 0,
        type: 'story',
        kids: hit.children || [],
        text: hit.story_text || hit.comment_text || '',
        dead: false,
        deleted: false
      }));

      // Filtra histórias inválidas ou deletadas
      const validStories = stories.filter(story => 
        story.title && 
        story.by && 
        !story.dead && 
        !story.deleted
      );

      // Ordena por pontuação
      const sortedStories = validStories.sort((a, b) => 
        (b.score || 0) - (a.score || 0)
      );

      this.cache.set(cacheKey, sortedStories, { ttl: this.searchTTL });
      return sortedStories;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Failed to perform search');
    }
  }
}

export const hackerNewsAPI = new HackerNewsAPI();
