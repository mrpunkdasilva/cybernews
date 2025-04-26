'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { useStories } from '@/hooks/useStories';
import { StoryList } from '@/components/features/StoryList';
import { LoadingTerminal } from '@/components/effects/LoadingTerminal';

export default function NewStoriesPage() {
  const { stories, loading, error, refreshStories } = useStories('new');

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshStories();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, [refreshStories]);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-4xl mx-auto px-4"
      >
        <TerminalWindow title="NEW_STORIES.exe" className="w-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-cyber-green text-xl font-terminal">
                [LATEST_SUBMISSIONS]
              </h1>
              <button 
                onClick={refreshStories}
                className="text-cyber-pink hover:text-cyber-pink-bright transition-colors"
                disabled={loading}
              >
                [{loading ? 'REFRESHING...' : 'REFRESH'}]
              </button>
            </div>

            {loading ? (
              <LoadingTerminal message="FETCHING_NEW_STORIES..." />
            ) : error ? (
              <div className="space-y-4">
                <div className="text-cyber-red">
                  [ERROR]: {error}
                </div>
                <button 
                  onClick={refreshStories}
                  className="text-cyber-green hover:text-cyber-green-bright transition-colors"
                >
                  [RETRY_CONNECTION]
                </button>
              </div>
            ) : (
              <StoryList stories={stories} />
            )}
          </div>
        </TerminalWindow>
      </motion.div>
    </MainLayout>
  );
}