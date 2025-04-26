import { useState, useEffect } from 'react';
import type { Story, Comment } from '@/shared/types/story';
import { ShowService } from '../services/showService';

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
        const { story, comments } = await ShowService.getStoryWithComments(Number(id));
        setStory(story);
        setComments(comments);
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