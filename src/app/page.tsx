'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStories } from '@/hooks/useStories';
import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
  const { stories, loading, error, loadMore } = useStories('top');

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.h1 
          className="text-4xl font-orbitron text-center bg-gradient-to-r from-cyber-neon to-cyber-pink bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to CYBERNEWS
        </motion.h1>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6">
          {loading ? (
            // Loading skeletons
            [...Array(10)].map((_, i) => (
              <div key={i} className="cyber-card animate-pulse">
                <div className="h-6 bg-cyber-neon/20 rounded w-3/4 mb-2" />
                <div className="h-4 bg-cyber-neon/20 rounded w-1/4" />
              </div>
            ))
          ) : (
            // Stories list
            stories.map((story) => (
              <motion.article
                key={story.id}
                className="cyber-card group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <a 
                  href={story.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h2 className="text-xl font-bold mb-2 group-hover:text-cyber-pink transition-colors">
                    {story.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{story.score} points</span>
                    <span>by {story.by}</span>
                    <span>{story.descendants} comments</span>
                  </div>
                </a>
              </motion.article>
            ))
          )}
        </div>

        <motion.button
          className="cyber-button mx-auto block"
          onClick={loadMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Load More
        </motion.button>
      </div>
    </MainLayout>
  );
}