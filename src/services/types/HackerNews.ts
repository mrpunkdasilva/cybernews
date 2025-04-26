export type ItemType = 'story' | 'job' | 'poll' | 'pollopt' | 'comment';
export type StoryType = 'top' | 'new' | 'best' | 'show' | 'ask';

export interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  kids?: number[];
  type: ItemType;
}

export interface SearchResult {
  hits: {
    objectID: string;
    title: string;
    url?: string;
    points: number;
    author: string;
    created_at_i: number;
    num_comments: number;
  }[];
}
