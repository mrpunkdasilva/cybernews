import { CommandAction } from './VoiceCommandRegistry';

interface MultilingualPatterns {
  'pt-BR': RegExp[];
  'en-US': RegExp[];
  'es-ES': RegExp[];
  'ja-JP': RegExp[];
}

export class MultilingualCommandRegistry {
  private commands: Map<string, {
    patterns: MultilingualPatterns;
    action: CommandAction;
  }> = new Map();

  private currentLang: keyof MultilingualPatterns = 'pt-BR';

  setLanguage(lang: keyof MultilingualPatterns) {
    this.currentLang = lang;
  }

  register(
    commandId: string,
    patterns: MultilingualPatterns,
    action: CommandAction
  ) {
    this.commands.set(commandId, { patterns, action });
  }

  processCommand(transcript: string): boolean {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const [, command] of Array.from(this.commands)) {
      const patterns = command.patterns[this.currentLang];
      for (const pattern of patterns) {
        const match = normalizedTranscript.match(pattern);
        if (match) {
          const args = match.slice(1);
          command.action(...args);
          return true;
        }
      }
    }

    return false;
  }
}

export const multilingualCommands = new MultilingualCommandRegistry();