'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [isHackerMode, setIsHackerMode] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cyber-black/80 backdrop-blur-sm border-b border-cyber-neon/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.span 
              className="text-2xl font-orbitron"
              whileHover={{ scale: 1.05 }}
            >
              CYBER<span className="text-cyber-pink">NEWS</span>
            </motion.span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/top" className="nav-link">Top</Link>
            <Link href="/new" className="nav-link">New</Link>
            <Link href="/best" className="nav-link">Best</Link>
            <Link href="/ask" className="nav-link">Ask</Link>
            <Link href="/show" className="nav-link">Show</Link>
          </div>

          {/* Search and Mode Toggle */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:text-cyber-pink transition-colors"
              onClick={() => setIsHackerMode(!isHackerMode)}
            >
              {isHackerMode ? '🖥️' : '📱'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}