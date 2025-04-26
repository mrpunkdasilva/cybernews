const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

// Cache em memória
const storyCache = new Map<number, Story>();
const idsCache = new Map<string, number[]>();

export type Story = {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
};

export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export const hackerNewsAPI = {
  async getStories(type: StoryType = 'top', page: number = 1, limit: number = 30): Promise<Story[]> {
    try {
      // Tentar obter IDs do cache
      const cacheKey = `${type}-ids`;
      let storyIds = idsCache.get(cacheKey);
      
      if (!storyIds) {
        const response = await fetch(`${BASE_URL}/${type}stories.json`);
        storyIds = await response.json();
        idsCache.set(cacheKey, storyIds);
        
        // Cache expira em 5 minutos
        setTimeout(() => idsCache.delete(cacheKey), 5 * 60 * 1000);
      }
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const pageStoryIds = storyIds.slice(start, end);
      
      // Separar IDs em cached e não-cached
      const cachedStories: Story[] = [];
      const uncachedIds: number[] = [];
      
      pageStoryIds.forEach(id => {
        const cachedStory = storyCache.get(id);
        if (cachedStory) {
          cachedStories.push(cachedStory);
        } else {
          uncachedIds.push(id);
        }
      });
      
      // Buscar histórias não cacheadas em batch
      const uncachedStories = await Promise.all(
        uncachedIds.map(async (id) => {
          try {
            const response = await fetch(`${BASE_URL}/item/${id}.json`);
            const story = await response.json();
            storyCache.set(id, story);
            return story;
          } catch (error) {
            console.error(`Failed to fetch story ${id}:`, error);
            return null;
          }
        })
      );
      
      // Combinar e filtrar histórias nulas
      const allStories = [...cachedStories, ...uncachedStories.filter(Boolean)];
      
      // Limpar cache periodicamente
      if (storyCache.size > 1000) {
        const oldestKeys = Array.from(storyCache.keys()).slice(0, 100);
        oldestKeys.forEach(key => storyCache.delete(key));
      }
      
      return allStories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  },

  async searchStories(query: string): Promise<Story[]> {
    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.hits.map((hit: any) => ({
        id: hit.objectID,
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
};
