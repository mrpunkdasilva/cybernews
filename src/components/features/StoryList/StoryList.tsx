'use client';

import type { Story } from '@/services/types/HackerNews';
import { StoryItem } from './StoryItem';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export interface StoryListProps {
  stories: Story[];
}

export function StoryList({ stories }: StoryListProps) {
  const { data: session, status } = useSession();
  const [savedStoryIds, setSavedStoryIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/posts/saved-ids')
        .then(res => res.json())
        .then((ids: number[]) => {
          setSavedStoryIds(new Set(ids));
        })
        .catch(err => console.error("Failed to fetch saved story IDs", err));
    }
  }, [status]);

  return (
    <div className="space-y-4">
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <StoryItem 
            story={story} 
            index={index + 1} 
            isSaved={savedStoryIds.has(story.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
