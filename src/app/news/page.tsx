'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';
import { parseUrl } from '@/utils/url';

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

  const shouldOpenInternally = (url: string | undefined): boolean => {
    if (!url) return true;
    const { hostname } = parseUrl(url);
    const internalDomains = [
      'news.ycombinator.com',
      'github.com',
      'gitlab.com',
      'stackoverflow.com'
    ];
    return internalDomains.some(domain => hostname.includes(domain));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
              className="cyber-card hover:border-cyber-pink transition-colors p-4"
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col space-y-3">
                <h2 className="text-xl font-bold text-cyber-green">
                  {story.title}
                </h2>
                
                <div className="flex items-center space-x-4 text-sm text-cyber-neon/70">
                  <span>{story.score} points</span>
                  <span>by {story.by}</span>
                  <span>{story.descendants} comments</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/show/${story.id}`}
                    className="px-4 py-2 bg-cyber-black border border-cyber-neon/30 hover:bg-cyber-neon/10 hover:border-cyber-neon transition-all text-cyber-neon"
                  >
                    View Discussion
                  </Link>

                  {story.url && !shouldOpenInternally(story.url) && (
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-cyber-black border border-cyber-pink/30 hover:bg-cyber-pink/10 hover:border-cyber-pink transition-all text-cyber-pink flex items-center gap-2"
                    >
                      <span>Visit Site</span>
                      <span className="text-xs">↗</span>
                      <span className="text-xs text-cyber-pink/50">
                        ({parseUrl(story.url).hostname})
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  );
}