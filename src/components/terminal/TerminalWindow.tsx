'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function TerminalWindow({ 
  children, 
  title = 'CYBERNEWS.EXE',
  className = '' 
}: TerminalWindowProps) {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState<string[]>([]);

  return (
    <div className={`bg-cyber-dark border border-cyber-neon/30 rounded-lg overflow-hidden ${className}`}>
      {/* Terminal header */}
      <div className="bg-cyber-neon/10 px-4 py-2 border-b border-cyber-neon/30">
        <div className="text-cyber-green font-terminal">{title}</div>
      </div>
      
      {/* Terminal content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}