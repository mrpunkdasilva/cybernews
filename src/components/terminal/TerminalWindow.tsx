'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
}

export function TerminalWindow({ children, title = 'CYBERNEWS.EXE' }: TerminalWindowProps) {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState<string[]>([]);

  useEffect(() => {
    const bootMessages = [
      'Initializing CyberNews system...',
      'Loading neural interface...',
      'Connecting to cybernet...',
      'Bypassing security protocols...',
      'Accessing Hacker News mainframe...',
      'Decrypting data streams...',
      'System ready.'
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < bootMessages.length) {
        setBootText(prev => [...prev, bootMessages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootSequence(false), 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500/50" />
        <div className="terminal-dot bg-yellow-500/50" />
        <div className="terminal-dot bg-green-500/50" />
        <span className="text-cyber-neon/70 ml-2 font-share-tech">
          {title}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {bootSequence ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {bootText.map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="terminal-text"
              >
                <span className="text-cyber-pink">&gt;</span> {text}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}