'use client';

import { useBestStories } from '@/features/best/hooks/useBestStories';
import { StoryList } from '@/components/features/StoryList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';

export default function BestPage() {
  const { stories, loading, error } = useBestStories();

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage message={error.message} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-orbitron text-cyber-neon">
            Best Stories
          </h1>
          <div className="h-px flex-grow bg-cyber-neon/20" />
        </div>

        <StoryList stories={stories} />
      </motion.div>
    </MainLayout>
  );
}
