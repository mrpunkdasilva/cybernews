'use client';

import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {(isListening || transcript || error) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 right-4 bg-cyber-black/80 text-cyber-neon p-4 rounded-lg border border-cyber-purple backdrop-blur z-[100]"
        >
          <div className="flex items-center gap-2">
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 bg-cyber-neon rounded-full"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyber-orange">
                  {currentLanguage}
                </span>
                {isListening && (
                  <span className="text-xs text-cyber-pink">
                    Listening...
                  </span>
                )}
              </div>
              {transcript && (
                <p className="text-sm font-share-tech mt-1">{transcript}</p>
              )}
              {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
