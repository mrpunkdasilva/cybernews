'use client';

import { useState, useEffect } from 'react';
import { Story } from '@/services/types/HackerNews';
import { hackerNewsAPI } from '@/services/hackerNewsAPI';

interface BestStoriesHook {
  stories: Story[];
  loading: boolean;
  error: Error | null;
  refreshStories: () => Promise<void>;
}

export function useBestStories(limit: number = 20): BestStoriesHook {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await hackerNewsAPI.getStories('best', 1);
      setStories(data.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch best stories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [limit]);

  const refreshStories = async () => {
    await fetchStories();
  };

  return { stories, loading, error, refreshStories };
}