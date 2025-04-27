'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + H', description: 'Toggle Hacker Mode' },
    { key: 'J', description: 'Next Article' },
    { key: 'K', description: 'Previous Article' },
    { key: '/', description: 'Search' },
    { key: 'ESC', description: 'Clear/Exit' },
  ];

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 p-2 bg-cyber-dark border border-cyber-neon rounded-md hover:bg-cyber-neon/10 z-[50]"
      >
        ⌨️ Shortcuts
      </button>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Overlay para fechar o modal ao clicar fora */}
            <div 
              className="fixed inset-0 bg-black/50 z-[51]"
              onClick={() => setIsVisible(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-16 right-4 p-4 bg-cyber-dark border border-cyber-neon rounded-md shadow-neon z-[52]"
            >
              <h3 className="text-cyber-neon mb-2">Keyboard Shortcuts</h3>
              <ul className="space-y-2">
                {shortcuts.map(({ key, description }) => (
                  <li key={key} className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-cyber-neon/10 border border-cyber-neon rounded">
                      {key}
                    </kbd>
                    <span>{description}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};