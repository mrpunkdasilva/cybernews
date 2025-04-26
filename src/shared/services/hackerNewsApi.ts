const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export class HackerNewsApi {
  static async fetchItem<T>(id: number): Promise<T> {
    const response = await fetch(`${BASE_URL}/item/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch item ${id}`);
    }
    return response.json();
  }

  static async fetchItems<T>(ids: number[]): Promise<T[]> {
    return Promise.all(
      ids.map(id => this.fetchItem<T>(id))
    );
  }

  static async fetchStoryIds(type: string): Promise<number[]> {
    const response = await fetch(`${BASE_URL}/${type}stories.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} stories`);
    }
    return response.json();
  }
}