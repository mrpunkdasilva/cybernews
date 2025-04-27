'use client';

import { useState, useEffect, useCallback } from 'react';
import type { 
  SpeechRecognition, 
  SpeechRecognitionErrorEvent 
} from '@/types/speech-recognition';

interface VoiceCommandOptions {
  lang?: string;
  continuous?: boolean;
  enableWakeWord?: boolean;
  wakeWord?: string;
}

interface VoiceCommandState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  recognition: SpeechRecognition | null;
}

const defaultOptions: VoiceCommandOptions = {
  lang: 'pt-BR',
  continuous: true,
  enableWakeWord: true,
  wakeWord: 'hey cyber'
};

export function useVoiceCommands(options: VoiceCommandOptions = defaultOptions) {
  const [state, setState] = useState<VoiceCommandState>({
    isListening: false,
    transcript: '',
    error: null,
    recognition: null
  });

  const initializeRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return null;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = options.continuous ?? true;
    recognition.interimResults = true;
    recognition.lang = options.lang ?? 'pt-BR';

    return recognition;
  }, [options]);

  const startListening = useCallback(() => {
    if (!state.recognition) {
      const recognition = initializeRecognition();
      if (!recognition) return;

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setState(prev => ({ ...prev, error: event.error }));
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setState(prev => ({ ...prev, transcript }));
      };

      setState(prev => ({ ...prev, recognition }));
      recognition.start();
    } else {
      state.recognition.start();
    }
  }, [state.recognition, initializeRecognition]);

  const stopListening = useCallback(() => {
    if (state.recognition) {
      state.recognition.stop();
    }
  }, [state.recognition]);

  useEffect(() => {
    return () => {
      if (state.recognition) {
        state.recognition.stop();
      }
    };
  }, [state.recognition]);

  return {
    isListening: state.isListening,
    transcript: state.transcript,
    error: state.error,
    startListening,
    stopListening
  };
}