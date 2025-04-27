'use client';

import { useEffect, useState } from 'react';
import { useVoiceCommands } from './useVoiceCommands';
import { multilingualCommands } from '@/services/voice/MultilingualCommands';
import { WakeWordDetector } from '@/services/voice/WakeWordDetector';
import { audioFeedback } from '@/services/voice/AudioFeedback';
import { useRouter } from 'next/navigation';
import { useTheme } from './useTheme';

type SupportedLanguage = 'pt-BR' | 'en-US' | 'es-ES' | 'ja-JP';

export function useVoiceInterface() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [lang, setLang] = useState<SupportedLanguage>('pt-BR');
  const wakeWordDetector = new WakeWordDetector();

  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  } = useVoiceCommands({ lang });

  // Debug logs mais detalhados
  useEffect(() => {
    if (transcript) {
      console.log('New transcript received:', transcript);
      console.log('Current language:', lang);
      console.log('Is listening:', isListening);
      console.log('Wake Word Active:', wakeWordDetector.isActive());
    }
  }, [transcript, lang, isListening]);

  useEffect(() => {
    multilingualCommands.setLanguage(lang);

    // Registro de comandos multilíngue
    multilingualCommands.register(
      'search',
      {
        'pt-BR': [/buscar (.+)/i, /procurar (.+)/i],
        'en-US': [/search (.+)/i, /find (.+)/i],
        'es-ES': [/buscar (.+)/i, /encontrar (.+)/i],
        'ja-JP': [/検索(.+)/i, /さがす(.+)/i]
      },
      (term) => {
        console.log('Executing search command with term:', term);
        audioFeedback.playSound('success');
        router.push(`/search?q=${encodeURIComponent(term)}`);
      }
    );

    multilingualCommands.register(
      'darkMode',
      {
        'pt-BR': [/modo noturno/i, /modo escuro/i],
        'en-US': [/dark mode/i, /night mode/i],
        'es-ES': [/modo oscuro/i, /modo noche/i],
        'ja-JP': [/ダークモード/i, /夜間モード/i]
      },
      () => {
        console.log('Executing dark mode command');
        audioFeedback.playSound('success');
        setTheme('dark');
      }
    );
  }, [router, setTheme, lang]);

  useEffect(() => {
    if (!transcript) return;

    // Tenta detectar wake word
    const isWakeWordDetected = wakeWordDetector.detectWakeWord(transcript, lang);
    console.log('Wake word detection result:', isWakeWordDetected);

    // Se o detector já está ativo ou acabou de detectar wake word
    if (wakeWordDetector.isActive() || isWakeWordDetected) {
      // Se acabou de detectar o wake word
      if (isWakeWordDetected) {
        console.log('Wake word just detected, activating...');
        audioFeedback.playSound('activate');
        return; // Retorna para não processar o próprio wake word como comando
      }

      // Processa o comando se o detector estiver ativo
      console.log('Attempting to process command:', transcript);
      const commandProcessed = multilingualCommands.processCommand(transcript);
      console.log('Command processing result:', commandProcessed);
      
      if (commandProcessed) {
        console.log('Command executed successfully, deactivating...');
        audioFeedback.playSound('success');
        wakeWordDetector.deactivate();
        stopListening();
      }
    }
  }, [transcript, lang, stopListening]);

  const toggleListening = async () => {
    try {
      if (isListening) {
        stopListening();
      } else {
        await startListening();
      }
    } catch (err) {
      console.error('Error in toggleListening:', err);
      throw err;
    }
  };

  return {
    isListening,
    transcript,
    error,
    toggleListening,
    setLanguage: setLang,
    currentLanguage: lang
  };
}