import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutsProps {
  onHackerMode: () => void;
  onSearch: () => void;
  onNextArticle: () => void;
  onPrevArticle: () => void;
  onEscape: () => void;
}

export const useKeyboardShortcuts = ({
  onHackerMode,
  onSearch,
  onNextArticle,
  onPrevArticle,
  onEscape,
}: KeyboardShortcutsProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Ignora eventos se estiver em um input/textarea
    if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
      return;
    }

    // Ctrl + H para Modo Hacker
    if (event.ctrlKey && (event.key === 'h' || event.key === 'H')) {
      event.preventDefault();
      onHackerMode();
      return;
    }

    switch (event.key.toLowerCase()) {
      case '/':
        event.preventDefault();
        onSearch();
        break;
      case 'j':
        event.preventDefault();
        onNextArticle();
        break;
      case 'k':
        event.preventDefault();
        onPrevArticle();
        break;
      case 'escape':
        event.preventDefault();
        onEscape();
        break;
    }
  }, [onHackerMode, onSearch, onNextArticle, onPrevArticle, onEscape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};