export type ItemType = 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface BaseItem {
  id: number;
  by: string;
  time: number;
  type: ItemType;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

export interface Story extends BaseItem {
  title: string;
  url?: string;
  text?: string;
  score: number;
  descendants: number;
}

export interface Comment extends BaseItem {
  text: string;
  parent: number;
}

export interface Poll extends BaseItem {
  title: string;
  text: string;
  score: number;
  parts: number[];
  descendants: number;
}

export interface PollOption extends BaseItem {
  text: string;
  score: number;
  parent: number;
}

export interface Job extends BaseItem {
  text: string;
  url?: string;
  title: string;
  score?: number;
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
  }>;
}
