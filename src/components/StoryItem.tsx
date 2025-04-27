import React from 'react';
import { Story } from "@/shared/types/story";
import { formatDistanceToNow } from '@/utils/date';

export const StoryItem: React.FC<{ story: Story }> = ({ story }) => {
  const {
    title = 'Untitled',
    url = '',
    score = 0,
    by = 'anonymous',
    time = Date.now() / 1000,
    descendants = 0
  } = story;

  const domain = url ? new URL(url).hostname : '';
  const timeAgo = formatDistanceToNow(time);

  return (
    <div className="story-item">
      <h2 className="story-title">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : (
          <span>{title}</span>
        )}
        {domain && <span className="story-domain">({domain})</span>}
      </h2>
      
      <div className="story-meta">
        {score > 0 && <span>{score} points</span>}
        {by && <span>by {by}</span>}
        <span>{timeAgo}</span>
        {descendants > 0 && (
          <span>
            {descendants} comment{descendants !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};