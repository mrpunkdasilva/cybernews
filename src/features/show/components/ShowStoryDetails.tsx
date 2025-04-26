import { motion } from 'framer-motion';
import type { Story } from '@/shared/types/story';

interface ShowStoryDetailsProps {
  story: Story;
}

export function ShowStoryDetails({ story }: ShowStoryDetailsProps) {
  return (
    <div className="space-y-4 mb-8">
      <h1 className="text-2xl font-bold text-cyber-neon">
        <span className="text-cyber-pink mr-2">&gt;</span>
        {story.title}
      </h1>
      
      <div className="text-sm text-cyber-neon/50">
        {story.score} points | by {story.by} | {story.descendants} comments
        {story.url && (
          <>
            {' '}| <a 
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-pink hover:underline"
            >
              Visit Link
            </a>
          </>
        )}
      </div>

      {story.text && (
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: story.text }}
        />
      )}
    </div>
  );
}