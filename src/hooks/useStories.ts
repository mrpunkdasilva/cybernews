import { useState, useCallback, useEffect, useRef } from 'react';
import { Story, StoryType } from '@/services/types/HackerNews';
import { hackerNewsAPI } from '@/services/hackerNewsAPI';

interface StoriesState {
  stories: Story[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export interface StoriesHook {
  stories: Story[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  refreshStories: () => Promise<void>;
  loadMore: () => void;
  lastStoryRef: React.RefObject<HTMLDivElement>;
}

const INITIAL_STATE: StoriesState = {
  stories: [],
  loading: true,
  error: null,
  hasMore: true,
  isLoadingMore: false,
};

const PAGE_SIZE = 20;

export function useStories(type: StoryType): StoriesHook {
  const [state, setState] = useState<StoriesState>(INITIAL_STATE);
  const [page, setPage] = useState(1);
  const lastStoryRef = useRef<HTMLDivElement>(null);

  const fetchStories = useCallback(async (pageNum: number, forceRefresh: boolean = false) => {
    try {
      setState(prev => ({ ...prev, loading: pageNum === 1, isLoadingMore: pageNum > 1 }));
      
      if (forceRefresh) {
        hackerNewsAPI.clearCache();
      }
      
      const fetchedStories = await hackerNewsAPI.getStories(type, pageNum);
      
      setState(prev => ({
        ...prev,
        stories: pageNum === 1 ? fetchedStories : [...prev.stories, ...fetchedStories],
        loading: false,
        error: null,
        hasMore: fetchedStories.length === PAGE_SIZE,
        isLoadingMore: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stories';
      setState(prev => ({
        ...prev,
        loading: false,
        isLoadingMore: false,
        error: errorMessage,
      }));
      console.error('Error fetching stories:', err);
    }
  }, [type]);

  const loadMore = useCallback(() => {
    if (!state.hasMore || state.isLoadingMore) return;
    setPage(prev => prev + 1);
  }, [state.hasMore, state.isLoadingMore]);

  const refreshStories = useCallback(async () => {
    setPage(1);
    return fetchStories(1, true);
  }, [fetchStories]);

  useEffect(() => {
    fetchStories(page);
  }, [fetchStories, page]);

  return {
    stories: state.stories,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    isLoadingMore: state.isLoadingMore,
    refreshStories,
    loadMore,
    lastStoryRef
  };
}
