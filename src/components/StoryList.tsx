import { useEffect, useRef } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { Story } from '@/shared/types/story';
import { StoryItem } from '@/components/features/StoryList/StoryItem';

export function StoryList({ stories }: { stories: Story[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollTo, isAtTop, isAtBottom } = useScroll();

  useEffect(() => {
    const handleVoiceScroll = (event: CustomEvent<{ direction: 'up' | 'down' }>) => {
      const { direction } = event.detail;
      console.log('Executando scroll:', direction);
      window.scrollBy({
        top: direction === 'up' ? -500 : 500,
        behavior: 'smooth'
      });
    };

    window.addEventListener('voice-scroll' as any, handleVoiceScroll);
    return () => window.removeEventListener('voice-scroll' as any, handleVoiceScroll);
  }, []);

  return (
    <div className="stories-container">
      {stories.map((story, index) => (
        <StoryItem 
          key={story.id} 
          story={story} 
          index={index + 1}
        />
      ))}
    </div>
  );
}