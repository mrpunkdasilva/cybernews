import { CommandAction } from './VoiceCommandRegistry';

export type CommandContext = 'global' | 'article' | 'search' | 'settings';

interface ContextualCommand {
  patterns: RegExp[];
  action: CommandAction;
  contexts: CommandContext[];
}

export class ContextAwareCommandRegistry {
  private commands: Map<string, ContextualCommand> = new Map();
  private currentContext: CommandContext = 'global';

  setContext(context: CommandContext) {
    this.currentContext = context;
  }

  register(
    commandId: string, 
    patterns: RegExp[], 
    action: CommandAction,
    contexts: CommandContext[] = ['global']
  ) {
    this.commands.set(commandId, { patterns, action, contexts });
  }

  processCommand(transcript: string): boolean {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const [, command] of Array.from(this.commands)) {
      if (command.contexts.includes(this.currentContext) || 
          command.contexts.includes('global')) {
        for (const pattern of command.patterns) {
          const match = normalizedTranscript.match(pattern);
          if (match) {
            const args = match.slice(1);
            command.action(...args);
            return true;
          }
        }
      }
    }

    return false;
  }
}

export const contextAwareCommands = new ContextAwareCommandRegistry();