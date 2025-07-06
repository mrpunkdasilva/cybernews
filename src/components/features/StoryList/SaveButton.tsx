
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface SaveButtonProps {
  storyId: number;
  isSavedInitially: boolean;
}

export function SaveButton({ storyId, isSavedInitially }: SaveButtonProps) {
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (status !== 'authenticated' || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/posts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
      } else {
        console.error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'authenticated') {
    return null; // Don't show the button if not logged in
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        isSaved
          ? 'bg-cyber-pink text-black'
          : 'border border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10'
      }`}
    >
      {isLoading ? '...' : isSaved ? 'Saved' : 'Save'}
    </button>
  );
}
