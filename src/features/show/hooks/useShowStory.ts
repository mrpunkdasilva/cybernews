import { useState, useEffect } from 'react';
import type { Story } from '@/services/types/HackerNews';
import { ShowService } from '../services/showService';

interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
  parent: number;
  type: 'comment';
}

interface UseShowStoryReturn {
  story: Story | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

export function useShowStory(id: string): UseShowStoryReturn {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        setLoading(true);
        const result = await ShowService.getStoryWithComments(Number(id));
        setStory(result.story);
        setComments(result.comments);
      } catch (err) {
        setError('Failed to fetch story details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStoryDetails();
    }
  }, [id]);

  return { story, comments, loading, error };
}