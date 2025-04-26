import { useState, useCallback, useEffect } from 'react';
import { Story } from '@/services/types/HackerNews';
import { ShowService } from '../services/showService';

export interface ShowStoriesHook {
  stories: Story[];
  loading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
  fetchMoreStories: () => Promise<void>;
}

const INITIAL_LIMIT = 20;
const LOAD_MORE_INCREMENT = 20;

export function useShowStories(): ShowStoriesHook {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async (limit: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ShowService.getShowStories(limit);
      setStories(data);
    } catch (err) {
      setError('Failed to fetch show stories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStories = useCallback(async () => {
    await fetchStories(INITIAL_LIMIT);
  }, [fetchStories]);

  const fetchMoreStories = useCallback(async () => {
    const newLimit = stories.length + LOAD_MORE_INCREMENT;
    await fetchStories(newLimit);
  }, [fetchStories, stories.length]);

  useEffect(() => {
    refreshStories();
  }, [refreshStories]);

  return { 
    stories, 
    loading, 
    error, 
    refreshStories,
    fetchMoreStories
  };
}