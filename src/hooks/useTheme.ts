import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'cyber';

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('cyber');

  useEffect(() => {
    // Recupera o tema salvo do localStorage na montagem inicial
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isDark = theme === 'dark' || theme === 'cyber';

  return { theme, setTheme, isDark };
}