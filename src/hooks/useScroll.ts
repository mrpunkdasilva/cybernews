import { useCallback, useEffect, useState } from 'react';

export function useScroll(containerRef?: React.RefObject<HTMLElement>) {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const calculateScrollState = useCallback(() => {
    const element = containerRef?.current || document.documentElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    setIsAtTop(scrollTop <= 0);
    setIsAtBottom(Math.ceil(scrollTop + clientHeight) >= scrollHeight);
  }, [containerRef]);

  const scrollTo = useCallback((direction: 'up' | 'down') => {
    const element = containerRef?.current || window;
    const scrollAmount = direction === 'up' ? -500 : 500;
    
    if ('scrollBy' in element) {
      element.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    } else {
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
    
    // Atualiza o estado após a rolagem
    setTimeout(calculateScrollState, 500);
  }, [containerRef, calculateScrollState]);

  useEffect(() => {
    const element = containerRef?.current || window;
    element.addEventListener('scroll', calculateScrollState);
    calculateScrollState();
    
    return () => element.removeEventListener('scroll', calculateScrollState);
  }, [containerRef, calculateScrollState]);

  return { scrollTo, isAtTop, isAtBottom };
}