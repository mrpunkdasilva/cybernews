const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

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
      const response = await fetch(`${BASE_URL}/${type}stories.json`);
      const storyIds = await response.json();
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const pageStoryIds = storyIds.slice(start, end);
      
      const stories = await Promise.all(
        pageStoryIds.map(async (id: number) => {
          const storyResponse = await fetch(`${BASE_URL}/item/${id}.json`);
          return storyResponse.json();
        })
      );
      
      return stories;
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