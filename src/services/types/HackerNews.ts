export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

export interface SearchResult {
  hits: Array<{
    objectID: string;
    title: string;
    url: string;
    points: number;
    author: string;
    created_at_i: number;
    num_comments: number;
    type: string;
  }>;
}