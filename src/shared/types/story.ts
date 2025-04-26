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

export interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
}