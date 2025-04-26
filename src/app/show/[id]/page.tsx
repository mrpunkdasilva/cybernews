'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { ShowStoryDetails } from '@/features/show/components/ShowStoryDetails';
import { ShowCommentList } from '@/features/show/components/ShowCommentList';
import { ShowStoryLoading } from '@/features/show/components/ShowStoryLoading';
import { useShowStory } from '@/features/show/hooks/useShowStory';

export default function ShowPage() {
  const params = useParams();
  const { story, comments, loading, error } = useShowStory(params.id as string);

  if (loading) {
    return (
      <MainLayout>
        <ShowStoryLoading />
      </MainLayout>
    );
  }

  if (error || !story) {
    return (
      <MainLayout>
        <div className="text-red-500">
          {error || 'Story not found'}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <TerminalWindow>
            <ShowStoryDetails story={story} />
            <ShowCommentList comments={comments} />
          </TerminalWindow>
        </motion.div>
      </div>
    </MainLayout>
  );
}