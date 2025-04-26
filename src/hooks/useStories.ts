import { useState, useEffect, useCallback, useRef } from 'react';
import { hackerNewsAPI, Story, StoryType } from '../services/hackerNewsAPI';

export function useStories(type: StoryType = 'top') {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Cache de referência para evitar duplicatas
  const storiesCache = useRef(new Set<number>());
  
  // Observer para infinite scroll
  const observerRef = useRef<IntersectionObserver>();
  const lastStoryRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        loadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, isLoadingMore]);

  const fetchStories = useCallback(async (pageNum: number, forceRefresh = false) => {
    try {
      setIsLoadingMore(true);
      
      // Se for refresh, limpa o estado atual
      if (forceRefresh) {
        setStories([]);
        storiesCache.current.clear();
      }
      
      const fetchedStories = await hackerNewsAPI.getStories(type, pageNum);
      
      const newStories = fetchedStories.filter(story => {
        if (storiesCache.current.has(story.id)) return false;
        storiesCache.current.add(story.id);
        return true;
      });

      setStories(prev => forceRefresh ? newStories : [...prev, ...newStories]);
      setHasMore(newStories.length > 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stories');
      console.error(err);
    } finally {
      setIsLoadingMore(false);
      setLoading(false);
    }
  }, [type]);

  // Carregar primeira página
  useEffect(() => {
    setLoading(true);
    setStories([]);
    storiesCache.current.clear();
    setPage(1);
    fetchStories(1);
  }, [type, fetchStories]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStories(nextPage);
    }
  }, [page, isLoadingMore, hasMore, fetchStories]);

  return {
    stories,
    loading,
    error,
    loadMore,
    hasMore,
    isLoadingMore,
    lastStoryRef,
    fetchStories // Exportando fetchStories para permitir refresh
  };
}
