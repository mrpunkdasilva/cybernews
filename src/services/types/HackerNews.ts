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

export interface AlgoliaHit {
  objectID: string;
  title: string | null;
  url: string | null;
  points: number | null;
  author: string | null;
  created_at_i: number;
  num_comments: number | null;
  story_text?: string | null;
  comment_text?: string | null;
  children?: number[];
}

export interface SearchResult {
  hits: AlgoliaHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}

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
  dead?: boolean;
  deleted?: boolean;
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
