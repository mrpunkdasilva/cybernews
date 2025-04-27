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
  } = useVoiceCommands({ lang }); // Pass the current language

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

    console.log('Processando transcrição:', transcript);

    // Primeiro, verifica se já está ativo
    if (wakeWordDetector.isActive()) {
      console.log('Detector já ativo, processando como comando:', transcript);
      const commandProcessed = multilingualCommands.processCommand(transcript);
      
      if (commandProcessed) {
        console.log('Comando executado com sucesso');
        audioFeedback.playSound('success');
        wakeWordDetector.deactivate();
        stopListening();
      } else {
        console.log('Comando não reconhecido');
      }
      return;
    }

    // Se não está ativo, tenta detectar wake word
    const { activated, isSearchCommand } = wakeWordDetector.detectWakeWord(transcript, lang);
    console.log('Resultado da detecção:', { activated, isSearchCommand });

    if (activated) {
      console.log('Wake word detectada');
      audioFeedback.playSound('activate');
      wakeWordDetector.activate();

      if (isSearchCommand) {
        // Extrai o termo de busca removendo a wake word
        const searchTerms = ['buscar', 'buscar por', 'procurar', 'procurar por', 'pesquisar', 'pesquisar por'];
        let searchTerm = transcript.toLowerCase();
        for (const term of searchTerms) {
          searchTerm = searchTerm.replace(term, '').trim();
        }
        
        if (searchTerm) {
          console.log('Executando busca por:', searchTerm);
          window.dispatchEvent(new CustomEvent('voice-search', { 
            detail: { searchTerm }
          }));
          audioFeedback.playSound('success');
          wakeWordDetector.deactivate();
        }
      }
      return;
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