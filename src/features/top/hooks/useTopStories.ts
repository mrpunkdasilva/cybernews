import { useState, useEffect } from 'react';
import { Story } from '@/services/types/HackerNews';
import { hackerNewsAPI } from '@/services/hackerNewsAPI';

interface TopStoriesHook {
  stories: Story[];
  loading: boolean;
  error: Error | null;
  refreshStories: () => Promise<void>;
}

export function useTopStories(): TopStoriesHook {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const fetchedStories = await hackerNewsAPI.getStories('top', 1);
      setStories(fetchedStories);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch top stories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const refreshStories = async () => {
    await fetchStories();
  };

  return { stories, loading, error, refreshStories };
}