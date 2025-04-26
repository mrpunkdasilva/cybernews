'use client';

import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { ShowStoryCard } from '@/features/show/components/ShowStoryCard';
import { useShowStories } from '@/features/show/hooks/useShowStories';

export default function ShowStoriesPage() {
  const { stories, loading, error } = useShowStories(20);

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
            <div className="text-red-500 mb-4">{error}</div>
          )}

          <div className="space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-cyber-neon/5 animate-pulse rounded" />
              ))
            ) : (
              stories.map(story => (
                <ShowStoryCard key={story.id} story={story} />
              ))
            )}
          </div>
        </TerminalWindow>
      </div>
    </MainLayout>
  );
}