'use client';

import { motion } from 'framer-motion';
import { useStories } from '@/hooks/useStories';
import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { CRTEffect } from '@/components/terminal/CRTEffect';

export default function HomePage() {
  const { stories, loading, error, loadMore } = useStories('top');

  return (
    <MainLayout>
      <CRTEffect />
      <div className="space-y-8 max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl font-share-tech text-center glitch"
          data-text="CYBERNEWS_"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          CYBERNEWS_
        </motion.h1>

        <TerminalWindow>
          {error && (
            <div className="terminal-text text-red-500 mb-4">
              ERROR: {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-cyber-neon/5 animate-pulse rounded" />
              ))
            ) : (
              stories.map((story) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="terminal-text group"
                >
                  <div className="flex items-start">
                    <span className="text-cyber-pink mr-2">&gt;</span>
                    <div>
                      <a 
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group-hover:text-cyber-pink transition-colors"
                      >
                        {story.title}
                      </a>
                      <div className="text-sm text-cyber-neon/50">
                        {story.score} points | by {story.by} | {story.descendants} comments
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          <motion.button
            className="mt-8 w-full terminal-text border border-cyber-neon/30 p-2 hover:bg-cyber-neon/10 transition-colors"
            onClick={loadMore}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            &gt; LOAD_MORE.exe
          </motion.button>
        </TerminalWindow>
      </div>
    </MainLayout>
  );
}