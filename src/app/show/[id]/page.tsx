'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { TerminalWindow } from '@/components/terminal/TerminalWindow';

interface Story {
  id: number;
  title: string;
  url: string;
  text?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  kids?: number[];
}

interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
}

export default function ShowPage() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${params.id}.json`);
        const data = await response.json();
        setStory(data);

        // Fetch top-level comments
        if (data.kids) {
          const commentPromises = data.kids.slice(0, 10).map(async (commentId: number) => {
            const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
            return commentResponse.json();
          });
          const fetchedComments = await Promise.all(commentPromises);
          setComments(fetchedComments);
        }
      } catch (err) {
        setError('Failed to fetch story details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <div className="h-8 bg-cyber-neon/5 animate-pulse rounded" />
          <div className="h-4 bg-cyber-neon/5 animate-pulse rounded w-3/4" />
          <div className="h-4 bg-cyber-neon/5 animate-pulse rounded w-1/2" />
        </div>
      </MainLayout>
    );
  }

  if (error || !story) {
    return (
      <MainLayout>
        <div className="text-red-500">
          {error || 'Story not found'}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <TerminalWindow>
            {/* Story Header */}
            <div className="space-y-4 mb-8">
              <h1 className="text-2xl font-bold text-cyber-neon">
                <span className="text-cyber-pink mr-2">&gt;</span>
                {story.title}
              </h1>
              
              <div className="text-sm text-cyber-neon/50">
                {story.score} points | by {story.by} | {story.descendants} comments
                {story.url && (
                  <>
                    {' '}| <a 
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-pink hover:underline"
                    >
                      Visit Link
                    </a>
                  </>
                )}
              </div>

              {story.text && (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: story.text }}
                />
              )}
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cyber-neon">
                <span className="text-cyber-pink mr-2">&gt;</span>
                Comments
              </h2>

              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-l-2 border-cyber-neon/20 pl-4 space-y-2"
                >
                  <div className="text-sm text-cyber-neon/50">
                    {comment.by} | {new Date(comment.time * 1000).toLocaleString()}
                  </div>
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                  />
                </motion.div>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>
      </div>
    </MainLayout>
  );
}