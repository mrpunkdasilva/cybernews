import { motion } from 'framer-motion';
import { useSearch } from '@/hooks/useSearch';
import type { Story } from '@/services/hackerNewsAPI';

interface SearchBarProps {
  onResultSelect: (story: Story) => void;
}

export function SearchBar({ onResultSelect }: SearchBarProps) {
  const { searchTerm, setSearchTerm, results, isSearching, error } = useSearch();

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 border border-cyber-neon/30 p-2">
        <span className="text-cyber-pink">&gt;</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                <button
                  key={story.id}
                  onClick={() => onResultSelect(story)}
                  className="w-full text-left p-4 hover:bg-cyber-neon/10 transition-colors"
                >
                  <h3 className="text-cyber-neon font-medium">{story.title}</h3>
                  <div className="text-sm text-cyber-neon/50 mt-1">
                    {story.score} points | by {story.by}
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}