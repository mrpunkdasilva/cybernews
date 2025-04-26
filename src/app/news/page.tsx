'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

export default function NewsPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stories List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {loading ? (
            // Loading Skeleton
            [...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="cyber-card animate-pulse"
              >
                <div className="h-6 bg-cyber-neon/20 rounded w-3/4 mb-2" />
                <div className="h-4 bg-cyber-neon/20 rounded w-1/4" />
              </div>
            ))
          ) : stories.map((story) => (
            <motion.article
              key={story.id}
              className="cyber-card hover:border-cyber-pink transition-colors cursor-pointer"
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold mb-2">{story.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{story.score} points</span>
                <span>by {story.by}</span>
                <span>{story.descendants} comments</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  );
}