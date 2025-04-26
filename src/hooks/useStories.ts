import { useState, useEffect } from 'react';
import { hackerNewsAPI, Story, StoryType } from '../services/hackerNewsAPI';

export function useStories(type: StoryType = 'top') {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const fetchedStories = await hackerNewsAPI.getStories(type, page);
        setStories(fetchedStories);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [type, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return {
    stories,
    loading,
    error,
    loadMore,
    page
  };
}