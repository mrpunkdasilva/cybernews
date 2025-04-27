export type CommandAction = (...args: string[]) => void;

interface Command {
  patterns: RegExp[];
  action: CommandAction;
}

export class VoiceCommandRegistry {
  private commands: Map<string, Command> = new Map();

  register(commandId: string, patterns: RegExp[], action: CommandAction) {
    this.commands.set(commandId, { patterns, action });
  }

  processCommand(transcript: string): boolean {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const [, command] of this.commands) {
      for (const pattern of command.patterns) {
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

export const voiceCommandRegistry = new VoiceCommandRegistry();