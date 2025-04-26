import { useState, useEffect } from 'react';
import { Story } from '@/shared/types/story';
import { ShowService } from '../services/showService';

export function useShowStories(limit: number = 20) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await ShowService.getShowStories(limit);
        setStories(data);
      } catch (err) {
        setError('Failed to fetch show stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [limit]);

  return { stories, loading, error };
}