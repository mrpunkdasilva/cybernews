'use client';

import React from 'react';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';
import { VoiceFeedback } from './VoiceFeedback';
import { motion } from 'framer-motion';

export function VoiceCommandButton() {
  const { 
    isListening, 
    transcript, 
    error, 
    toggleListening,
    currentLanguage 
  } = useVoiceInterface();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleListening();
    } catch (err) {
      console.error('Error toggling voice recognition:', err);
    }
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`fixed bottom-20 right-4 p-4 rounded-full 
          ${isListening 
            ? 'bg-cyan-500 ring-2 ring-cyan-300 ring-opacity-50' 
            : 'bg-gray-800 hover:bg-gray-700'
          } 
          text-white shadow-lg transition-all duration-200 z-[60]
          flex items-center justify-center
        `}
        title={isListening ? 'Tap to stop listening' : 'Tap to start listening'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${isListening ? 'animate-pulse' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </motion.button>

      <VoiceFeedback
        isListening={isListening}
        transcript={transcript}
        error={error}
        currentLanguage={currentLanguage}
      />
    </>
  );
}