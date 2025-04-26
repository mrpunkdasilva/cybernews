import { useState, useCallback, useEffect } from 'react';
import { hackerNewsAPI } from '@/services/hackerNewsAPI';
import type { Story } from '@/services/types/HackerNews';
import { useDebounce } from './useDebounce';

interface SearchState {
  results: Story[];
  isSearching: boolean;
  error: string | null;
}

const INITIAL_STATE: SearchState = {
  results: [],
  isSearching: false,
  error: null,
};

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState<SearchState>(INITIAL_STATE);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setState(INITIAL_STATE);
      return;
    }

    setState(prev => ({ ...prev, isSearching: true, error: null }));

    try {
      const results = await hackerNewsAPI.searchStories(term);
      setState({
        results,
        isSearching: false,
        error: null,
      });
    } catch (error) {
      setState({
        results: [],
        isSearching: false,
        error: 'Failed to perform search',
      });
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  return {
    searchTerm,
    setSearchTerm,
    ...state,
  };
}