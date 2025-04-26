'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcuts } from '@/components/common/KeyboardShortcuts';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleHackerMode = useCallback(() => {
    console.log('Toggling hacker mode'); // Debug
    setIsHackerMode(prev => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    const searchInput = document.querySelector('#search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      setSearchFocused(true);
    }
  }, []);

  const handleNextArticle = useCallback(() => {
    // Implementar navegação para o próximo artigo
  }, []);

  const handlePrevArticle = useCallback(() => {
    // Implementar navegação para o artigo anterior
  }, []);

  const handleEscape = useCallback(() => {
    if (searchFocused) {
      const searchInput = document.querySelector('#search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.blur();
        searchInput.value = '';
      }
      setSearchFocused(false);
    }
  }, [searchFocused]);

  useKeyboardShortcuts({
    onHackerMode: handleHackerMode,
    onSearch: handleSearch,
    onNextArticle: handleNextArticle,
    onPrevArticle: handlePrevArticle,
    onEscape: handleEscape,
  });

  return (
    <div className={`app-container ${isHackerMode ? 'hacker-mode' : ''}`}>
      {children}
      <KeyboardShortcuts />
      {/* Indicador visual do modo hacker */}
      {isHackerMode && (
        <div className="fixed top-2 right-2 px-2 py-1 bg-cyber-neon/10 border border-cyber-neon rounded text-cyber-neon">
          HACKER MODE
        </div>
      )}
    </div>
  );
}