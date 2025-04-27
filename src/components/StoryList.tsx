import { useEffect } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { Story } from '@/shared/types/story';
import { StoryItem } from '@/components/features/StoryList/StoryItem';

export function StoryList({ stories }: { stories: Story[] }) {
  const { scrollTo, isAtTop, isAtBottom } = useScroll();  // Removemos o containerRef aqui

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
      {stories.map((story) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </div>
  );
}