import { useState, useCallback, useEffect } from 'react';
import { Story } from '@/services/types/HackerNews';
import { hackerNewsAPI } from '@/services/hackerNewsAPI';

type StoryType = 'top' | 'new' | 'best' | 'show' | 'ask';

export function useStories(type: StoryType) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedStories = await hackerNewsAPI.getStories(type);
      setStories(fetchedStories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stories';
      setError(errorMessage);
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const refreshStories = useCallback(() => {
    setRetryCount(count => count + 1);
    hackerNewsAPI.clearCache(); // Clear cache on manual refresh
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories, retryCount]);

  return {
    stories,
    loading,
    error,
    refreshStories
  };
}