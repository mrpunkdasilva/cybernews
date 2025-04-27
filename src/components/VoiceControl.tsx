import React from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface CommandInfo {
  icon: string;
  command: string;
  description: string;
}

const VOICE_COMMANDS: CommandInfo[] = [
  { icon: '📱', command: '"próxima" ou "next"', description: 'Próxima história' },
  { icon: '🔍', command: '"buscar [termo]"', description: 'Pesquisar histórias' },
  { icon: '🎨', command: '"tema [nome]"', description: 'Mudar tema' },
  { icon: '💾', command: '"salvar"', description: 'Salvar história atual' },
  { icon: '📖', command: '"ler"', description: 'Abrir história atual' },
  { icon: '🏷️', command: '"filtrar [tipo]"', description: 'Filtrar histórias' },
  { icon: '🌓', command: '"modo [tipo]"', description: 'Mudar modo de visualização' },
  { icon: '⬆️', command: '"rolar [direção]"', description: 'Rolar página' },
  { icon: '🔄', command: '"atualizar"', description: 'Recarregar histórias' },
  { icon: '❓', command: '"ajuda"', description: 'Mostrar comandos' },
];

export const VoiceControl: React.FC = () => {
  const { 
    isListening, 
    transcript, 
    error, 
    startListening, 
    stopListening
  } = useVoiceCommands({ lang: 'pt-BR' });

  return (
    <div className="voice-control p-4 bg-background rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`voice-button px-6 py-3 rounded-full text-lg font-semibold transition-all
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-primary hover:bg-primary/90 text-white'
            }`}
        >
          {isListening ? '🎤 Ouvindo...' : '🎤 Iniciar'}
        </button>

        {transcript && (
          <div className="transcript mt-4 p-3 bg-muted rounded-lg text-foreground">
            "{transcript}"
          </div>
        )}

        {error && (
          <div className="error mt-4 p-3 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="commands-list">
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          Comandos Disponíveis:
        </h3>
        <ul className="space-y-2">
          {VOICE_COMMANDS.map((command, index) => (
            <li 
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <span className="text-2xl">{command.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {command.command}
                </span>
                <span className="text-sm text-muted-foreground">
                  {command.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};