import { useState, useEffect } from 'react';
import { Story } from '@/services/types/HackerNews';
import { HackerNewsApi } from '@/shared/services/hackerNewsApi';

export function useAskStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const ids = await HackerNewsApi.fetchStoryIds('ask');
        const fetchedStories = await HackerNewsApi.fetchItems<Story>(ids.slice(0, 30));
        setStories(fetchedStories.map(story => ({
          ...story,
          type: 'story' as const
        })));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch ask stories'));
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return { stories, loading, error };
}