import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Story } from '@/shared/types/story';

interface ShowStoryCardProps {
  story: Story;
}

export function ShowStoryCard({ story }: ShowStoryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <div className="flex items-start">
        <span className="text-cyber-pink mr-2">&gt;</span>
        <div>
          <Link 
            href={`/show/${story.id}`}
            className="block text-lg hover:text-cyber-pink transition-colors"
          >
            {story.title}
          </Link>
          <div className="text-sm text-cyber-neon/50">
            {story.score} points | by {story.by} | {story.descendants} comments
          </div>
        </div>
      </div>
    </motion.article>
  );
}