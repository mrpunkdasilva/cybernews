'use client';

import { useState, useEffect } from 'react';
import { BestService } from '../services/bestService';
import type { Story } from '@/services/types/HackerNews';

export function useBestStories(limit: number = 20) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await BestService.getBestStories(limit);
        setStories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch best stories'));
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [limit]);

  return { stories, loading, error };
}