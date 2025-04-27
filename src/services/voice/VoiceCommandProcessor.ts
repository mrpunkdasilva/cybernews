import { commands, VoiceCommand } from './commands';

export class VoiceCommandProcessor {
  private currentLanguage: string = 'pt-BR';
  private lastCommandTime: number = 0;
  private readonly COMMAND_COOLDOWN = 1000; // 1 segundo entre comandos

  setLanguage(lang: string) {
    this.currentLanguage = lang;
  }

  async processCommand(transcript: string): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastCommandTime < this.COMMAND_COOLDOWN) {
      console.log('Command attempted too soon');
      return false;
    }

    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const [commandName, command] of Object.entries(commands)) {
      const patterns = command.patterns[this.currentLanguage] || command.patterns['en-US'];
      
      for (const pattern of patterns) {
        const match = normalizedTranscript.match(pattern);
        if (match) {
          console.log(`Executing command: ${commandName}`);
          const args = match[1] ? match[1].trim() : undefined;
          
          try {
            await command.action(args);
            this.lastCommandTime = now;
            return true;
          } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            return false;
          }
        }
      }
    }

    return false;
  }

  getAvailableCommands(): string[] {
    return Object.entries(commands).map(([_, command]) => {
      return `${command.icon} ${command.description}`;
    });
  }
}

export const voiceCommandProcessor = new VoiceCommandProcessor();