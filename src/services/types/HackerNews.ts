export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface Story {
  id: number;
  title: string;
  url?: string;
  text?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: 'story' | 'job' | 'comment' | 'poll' | 'pollopt';
  kids?: number[];
}

export interface SearchResult {
  hits: {
    objectID: string;
    title: string;
    url: string;
    points: number;
    author: string;
    created_at_i: number;
    num_comments: number;
  }[];
}
