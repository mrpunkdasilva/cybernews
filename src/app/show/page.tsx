'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { LoadingTerminal } from '@/components/effects/LoadingTerminal';
import { ShowStoryCard } from '@/features/show/components/ShowStoryCard';
import { useShowStories } from '@/features/show/hooks/useShowStories';
import { motion } from 'framer-motion';

export default function ShowStoriesPage() {
  const { stories, loading, error, refreshStories, fetchMoreStories } = useShowStories();

  const handleRefresh = async () => {
    await refreshStories();
  };

  const handleLoadMore = async () => {
    await fetchMoreStories();
  };

  if (loading && stories.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingTerminal message="LOADING SHOW HN STORIES..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Show HN
        </motion.h1>

        <TerminalWindow>
          {error && (
            <div className="text-red-500 mb-4">
              <p>{error}</p>
              <button 
                onClick={handleRefresh}
                className="text-cyber-neon hover:text-cyber-pink transition-colors mt-2"
              >
                RETRY_CONNECTION();
              </button>
            </div>
          )}

          <div className="space-y-4">
            {stories.map(story => (
              <ShowStoryCard key={story.id} story={story} />
            ))}
          </div>

          {!loading && !error && stories.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="text-cyber-neon hover:text-cyber-pink transition-colors"
                disabled={loading}
              >
                {loading ? 'LOADING...' : 'LOAD_MORE();'}
              </button>
            </div>
          )}
        </TerminalWindow>
      </div>
    </MainLayout>
  );
}