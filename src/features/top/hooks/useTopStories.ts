import { useState, useEffect } from 'react';
import { Story } from '@/services/types/HackerNews';
import { TopService } from '../services/topService';

export function useTopStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const fetchedStories = await TopService.getTopStories(30);
        setStories(fetchedStories);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch top stories'));
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return { stories, loading, error };
}