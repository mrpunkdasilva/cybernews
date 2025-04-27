import { motion } from 'framer-motion';
import { useSearch } from '@/hooks/useSearch';
import type { Story } from '@/services/types/HackerNews';
import Link from 'next/link';
import { forwardRef, useEffect } from 'react';

interface SearchBarProps {
  onResultSelect?: (story: Story) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onResultSelect, onFocus, onBlur }, ref) => {
    const { searchTerm, setSearchTerm, results, isSearching, error } = useSearch();

    useEffect(() => {
      const handleVoiceSearch = (event: CustomEvent) => {
        // Apenas processa eventos de pesquisa por voz
        if (event.type === 'voice-search') {
          const { searchTerm } = event.detail;
          setSearchTerm(searchTerm);
        }
      };

      window.addEventListener('voice-search', handleVoiceSearch as EventListener);
      
      return () => {
        window.removeEventListener('voice-search', handleVoiceSearch as EventListener);
      };
    }, [setSearchTerm]);

    const handleResultClick = (story: Story) => {
      if (onResultSelect) {
        onResultSelect(story);
      }
      setSearchTerm('');
    };

    return (
      <div className="relative">
        <div className="flex items-center space-x-2 border border-cyber-neon/30 p-2">
          <span className="text-cyber-pink">&gt;</span>
          <input
            ref={ref}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="SEARCH_ARTICLES.exe"
            className="bg-transparent border-none outline-none w-full text-cyber-neon placeholder-cyber-neon/30"
          />
          {isSearching && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-cyber-neon/50"
            >
              Searching...
            </motion.span>
          )}
        </div>

        {/* Results Dropdown */}
        {(results.length > 0 || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 w-full mt-2 border border-cyber-neon/30 bg-cyber-black/95 max-h-96 overflow-y-auto"
          >
            {error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : (
              <div className="divide-y divide-cyber-neon/10">
                {results.map((story) => (
                  <Link
                    key={story.id}
                    href={`/show/${story.id}`}
                    onClick={() => handleResultClick(story)}
                    className="block w-full text-left p-4 hover:bg-cyber-neon/10 group"
                  >
                    <h3 className="text-cyber-neon font-medium">{story.title}</h3>
                    <div className="text-sm text-cyber-neon/50 mt-1 flex items-center space-x-4">
                      <span>{story.score} points</span>
                      <span>by {story.by}</span>
                      <span>{story.descendants} comments</span>
                      {story.url && (
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyber-pink hover:text-cyber-pink-bright"
                          onClick={(e) => e.stopPropagation()}
                        >
                          external link ↗
                        </a>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
