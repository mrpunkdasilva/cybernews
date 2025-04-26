'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStories } from '@/hooks/useStories';
import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { CRTEffect } from '@/components/terminal/CRTEffect';
import Link from 'next/link';

export default function HomePage() {
  const { stories, loading, error, loadMore } = useStories('top');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pull-to-refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulating refresh - you'll need to implement actual refresh logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <MainLayout>
      <CRTEffect />
      <div className="space-y-8 max-w-4xl mx-auto px-4">
        {/* Terminal-style Header */}
        <motion.div 
          className="terminal-window p-4 border border-cyber-neon/30 bg-cyber-black/80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="terminal-header text-cyber-neon/70 mb-4">
            <span className="text-cyber-pink">root@cybernews</span>:<span className="text-cyber-neon">~</span>$ status
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-cyber-pink">&gt;</span> Articles: {stories.length}
            </div>
            <div>
              <span className="text-cyber-pink">&gt;</span> Status: {loading ? 'LOADING' : 'ONLINE'}
            </div>
            <div>
              <span className="text-cyber-pink">&gt;</span> Mode: TERMINAL_VIEW
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link href="/show" className="terminal-button">
            <button className="w-full p-3 border border-cyber-neon/30 hover:bg-cyber-neon/10 transition-all">
              SHOW_HN.exe
            </button>
          </Link>
          <Link href="/news" className="terminal-button">
            <button className="w-full p-3 border border-cyber-neon/30 hover:bg-cyber-neon/10 transition-all">
              NEWS.exe
            </button>
          </Link>
          <button 
            onClick={handleRefresh}
            className="w-full p-3 border border-cyber-neon/30 hover:bg-cyber-neon/10 transition-all"
          >
            {isRefreshing ? 'REFRESHING...' : 'REFRESH.exe'}
          </button>
          <button 
            className="w-full p-3 border border-cyber-pink/30 hover:bg-cyber-pink/10 transition-all"
            onClick={() => document.documentElement.requestFullscreen()}
          >
            TERMINAL_MODE.exe
          </button>
        </motion.div>

        {/* Main Content */}
        <TerminalWindow>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border border-cyber-neon/30 p-2">
              <span className="text-cyber-pink">&gt;</span>
              <input
                type="text"
                placeholder="SEARCH_ARTICLES.exe"
                className="bg-transparent border-none outline-none w-full text-cyber-neon placeholder-cyber-neon/30"
              />
            </div>
          </div>

          {error && (
            <div className="terminal-text text-red-500 mb-4">
              ERROR: {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="h-20 bg-cyber-neon/5 animate-pulse rounded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))
            ) : (
              stories.map((story) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="terminal-text group hover:bg-cyber-neon/5 p-4 border border-transparent hover:border-cyber-neon/30 transition-all"
                >
                  <div className="flex items-start">
                    <span className="text-cyber-pink mr-2">&gt;</span>
                    <div>
                      <Link 
                        href={`/show/${story.id}`}
                        className="block group-hover:text-cyber-pink transition-colors"
                      >
                        {story.title}
                      </Link>
                      <div className="text-sm text-cyber-neon/50 flex items-center space-x-4">
                        <span>{story.score} points</span>
                        <span>by {story.by}</span>
                        <span>{story.descendants} comments</span>
                        {story.url && (
                          <a 
                            href={story.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyber-pink hover:underline"
                          >
                            Visit Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          <motion.button
            className="mt-8 w-full terminal-text border border-cyber-neon/30 p-2 hover:bg-cyber-neon/10 transition-all"
            onClick={loadMore}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            &gt; LOAD_MORE.exe
          </motion.button>
        </TerminalWindow>

        {/* Terminal Footer */}
        <motion.div 
          className="text-center text-cyber-neon/30 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>CYBERNEWS_TERMINAL v1.0.0 | Press '/' to search | ESC to clear</p>
        </motion.div>
      </div>
    </MainLayout>
  );
}