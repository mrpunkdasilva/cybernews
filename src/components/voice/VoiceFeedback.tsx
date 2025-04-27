'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { commandProcessor } from '@/services/voice/CommandProcessor';

interface VoiceFeedbackProps {
  isListening: boolean;
  transcript: string;
  error: string | null;
  currentLanguage: string;
}

export function VoiceFeedback({ 
  isListening, 
  transcript, 
  error, 
  currentLanguage 
}: VoiceFeedbackProps) {
  const [showCommands, setShowCommands] = React.useState(false);
  const commands = commandProcessor.getAvailableCommands();

  const getLanguageLabel = (lang: string) => {
    const labels = {
      'pt-BR': '🇧🇷 Português',
      'en-US': '🇺🇸 English',
      'es-ES': '🇪🇸 Español',
      'ja-JP': '🇯🇵 日本語'
    };
    return labels[lang as keyof typeof labels] || lang;
  };

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-32 right-4 p-4 bg-gray-800 rounded-lg shadow-lg text-white max-w-sm z-50"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cyan-400">
                {getLanguageLabel(currentLanguage)}
              </span>
              <button
                onClick={() => setShowCommands(!showCommands)}
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
              >
                {showCommands ? 'Hide Commands' : 'Show Commands'}
              </button>
            </div>

            {error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : (
              <p className="text-sm font-mono">{transcript || 'Listening...'}</p>
            )}

            <AnimatePresence>
              {showCommands && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 border-t border-gray-700 pt-2">
                    <h3 className="text-sm font-medium text-cyan-400 mb-2">
                      Available Commands:
                    </h3>
                    <ul className="text-xs space-y-1">
                      {commands.map((command, index) => (
                        <li 
                          key={index}
                          className="flex items-center gap-2"
                        >
                          <span className="text-cyan-400">•</span>
                          <span>{command}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Listening
              </span>
              <span>•</span>
              <span>Tap mic to stop</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
