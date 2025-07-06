import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Story } from '@/services/types/HackerNews';
import { parseUrl } from '@/utils/url';
import { SaveButton } from './SaveButton';

export interface StoryItemProps {
  story: Story;
  index: number;
  isSaved: boolean;
}

export function StoryItem({ story, index, isSaved }: StoryItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className="border border-cyber-neon/30 p-4 hover:bg-cyber-neon/5 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-4">
        <span className="text-cyber-pink font-mono">
          {index.toString().padStart(2, '0')}
        </span>
        <div className="space-y-2 flex-1">
          <div className="flex flex-col gap-2">
            <Link 
              href={`/show/${story.id}`}
              className="group flex items-start gap-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div 
                className="text-cyber-green hover:text-cyber-green-bright transition-colors"
                animate={{ x: isHovered ? 10 : 0 }}
              >
                <h2 className="text-lg">{story.title}</h2>
                {story.url && (
                  <span className="text-sm text-cyber-neon/50">
                    ({parseUrl(story.url).hostname})
                    <span className="ml-2">↗</span>
                  </span>
                )}
              </motion.div>
            </Link>

            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyber-pink/70 hover:text-cyber-pink transition-colors flex items-center gap-1"
              >
                Visit external link ↗
              </a>
            )}
          </div>
          
          <div className="text-sm text-cyber-neon/70 flex items-center gap-4">
            <span>{story.score} points</span>
            <Link 
              href={`/user/${story.by}`}
              className="hover:text-cyber-pink transition-colors"
            >
              by {story.by}
            </Link>
            <span>{story.time}</span>
            <Link 
              href={`/show/${story.id}`}
              className="hover:text-cyber-neon transition-colors flex items-center gap-1"
            >
              <span>{story.descendants || 0}</span>
              <span className="text-cyber-neon/50">comments</span>
            </Link>
            <SaveButton storyId={story.id} isSavedInitially={isSaved} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}