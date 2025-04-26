import type { Story } from '@/services/types/HackerNews';
import { StoryItem } from './StoryItem';
import { motion } from 'framer-motion';

export interface StoryListProps {
  stories: Story[];
}

export function StoryList({ stories }: StoryListProps) {
  return (
    <div className="space-y-4">
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <StoryItem story={story} index={index + 1} />
        </motion.div>
      ))}
    </div>
  );
}
