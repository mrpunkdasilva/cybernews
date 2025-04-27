interface Command {
  patterns: string[];
  action: (args: string | '') => Promise<void>;  // Aceita string ou string vazia
  description: string;
}

export class CommandProcessor {
  private commands: Map<string, Command> = new Map([
    ['navigation', {
      patterns: [
        'próxima (página|notícia)',
        'next (page|story)',
        'siguiente',
        '次へ'
      ],
      action: async (args: string) => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
      },
      description: 'Navigate to next item'
    }],
    ['search', {
      patterns: [
        'procurar por (.*)',
        'buscar (.*)',
        'pesquisar (.*)',
        'search for (.*)',
        'search (.*)',
        'buscar (.*)',
        '検索 (.*)'
      ],
      action: async (args?: string) => {
        if (!args) return;
        
        // Dispara um evento customizado para integrar melhor com o React
        window.dispatchEvent(new CustomEvent('voice-search', { 
          detail: { searchTerm: args }
        }));
        
        // Fallback: tenta atualizar o input diretamente se necessário
        const searchInput = document.querySelector('input[placeholder="SEARCH_ARTICLES.exe"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = args;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      description: 'Search for content'
    }],
    ['theme', {
      patterns: [
        'tema (.*)',
        'mudar tema para (.*)',
        'theme (.*)',
        'change theme to (.*)',
        'テーマ (.*)'
      ],
      action: async (themeName: string) => {
        if (themeName) {
          window.dispatchEvent(new CustomEvent('change-theme', { 
            detail: { theme: themeName.toLowerCase() }
          }));
        }
      },
      description: 'Change application theme'
    }],
    ['save', {
      patterns: [
        'salvar (notícia|história)',
        'save (story|article)',
        'guardar',
        '保存'
      ],
      action: async (args: string) => {
        const activeStory = document.querySelector('.story.active');
        if (activeStory) {
          const storyId = activeStory.getAttribute('data-story-id');
          window.dispatchEvent(new CustomEvent('save-story', { 
            detail: { id: storyId }
          }));
        }
      },
      description: 'Save current story'
    }],
    ['read', {
      patterns: [
        'ler (notícia|história)',
        'read (story|article)',
        'leer',
        '読む'
      ],
      action: async (args: string) => {
        const activeStory = document.querySelector('.story.active');
        if (activeStory) {
          const storyLink = activeStory.querySelector('a[href]') as HTMLAnchorElement;
          if (storyLink) window.open(storyLink.href, '_blank');
        }
      },
      description: 'Open current story'
    }],
    ['filter', {
      patterns: [
        'filtrar por (.*)',
        'mostrar (.*)',
        'filter (.*)',
        'show (.*)',
        'フィルター (.*)'
      ],
      action: async (filter: string) => {
        if (filter) {
          window.dispatchEvent(new CustomEvent('apply-filter', { 
            detail: { filter: filter.toLowerCase() }
          }));
        }
      },
      description: 'Filter stories'
    }],
    ['mode', {
      patterns: [
        'modo (.*)',
        'ativar modo (.*)',
        'mode (.*)',
        'activate (.*) mode',
        'モード (.*)'
      ],
      action: async (mode: string) => {
        if (mode) {
          window.dispatchEvent(new CustomEvent('change-mode', { 
            detail: { mode: mode.toLowerCase() }
          }));
        }
      },
      description: 'Change application mode'
    }],
    ['scroll', {
      patterns: [
        'rolar (para )?cima',
        'rolar (para )?baixo',
        'scroll (up|down)',
        'スクロール(上|下)'
      ],
      action: async (direction: string) => {
        const amount = direction.includes('up') ? -300 : 300;
        window.scrollBy({ top: amount, behavior: 'smooth' });
      },
      description: 'Scroll page'
    }],
    ['refresh', {
      patterns: [
        'atualizar',
        'recarregar',
        'refresh',
        'reload',
        'リロード'
      ],
      action: async (args: string) => {
        window.dispatchEvent(new CustomEvent('refresh-stories'));
      },
      description: 'Refresh stories'
    }],
    ['help', {
      patterns: [
        'ajuda',
        'comandos',
        'help',
        'commands',
        'ヘルプ'
      ],
      action: async (args: string) => {
        window.dispatchEvent(new CustomEvent('show-commands'));
      },
      description: 'Show available commands'
    }]
  ]);

  private lastCommand: string = '';
  private lastCommandTime: number = 0;
  private readonly COMMAND_COOLDOWN = 1000; // 1 segundo entre comandos

  async processCommand(transcript: string, lang: string = 'pt-BR'): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastCommandTime < this.COMMAND_COOLDOWN) {
      console.log('Command attempted too soon after last command');
      return false;
    }

    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const [name, command] of this.commands) {
      for (const pattern of command.patterns) {
        const regex = new RegExp(pattern, 'i');
        const match = normalizedTranscript.match(regex);

        if (match) {
          console.log(`Command detected: ${name}`);
          const args = match[1] ? match[1].trim() : '';
          
          try {
            await command.action(args);
            this.lastCommand = name;
            this.lastCommandTime = now;
            return true;
          } catch (error) {
            console.error(`Error executing command ${name}:`, error);
            return false;
          }
        }
      }
    }

    return false;
  }

  getLastCommand(): string {
    return this.lastCommand;
  }

  getAvailableCommands(): string[] {
    const commands = Array.from(this.commands.entries()).map(([name, cmd]) => {
      const examples = cmd.patterns
        .filter(p => p.includes('(.*)'))[0]
        ?.replace(/\((.*?)\)/g, '___')
        .split('___')[0]
        .trim() || cmd.patterns[0];

      switch (name) {
        case 'navigation':
          return '📱 "próxima" ou "next" - Próxima história';
        case 'search':
          return '🔍 "buscar [termo]" - Pesquisar histórias';
        case 'theme':
          return '🎨 "tema [nome]" - Mudar tema';
        case 'save':
          return '💾 "salvar" - Salvar história atual';
        case 'read':
          return '📖 "ler" - Abrir história atual';
        case 'filter':
          return '🏷️ "filtrar [tipo]" - Filtrar histórias';
        case 'mode':
          return '🌓 "modo [tipo]" - Mudar modo de visualização';
        case 'scroll':
          return '⬆️ "rolar [direção]" - Rolar página';
        case 'refresh':
          return '🔄 "atualizar" - Recarregar histórias';
        case 'help':
          return '❓ "ajuda" - Mostrar comandos';
        default:
          return `${examples} - ${cmd.description}`;
      }
    });

    return commands;
  }
}

export const commandProcessor = new CommandProcessor();