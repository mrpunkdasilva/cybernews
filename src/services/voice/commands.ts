import { showScrollFeedback } from '@/utils/feedback';

export interface VoiceCommand {
  patterns: {
    [key: string]: RegExp[]; // key é o código do idioma (pt-BR, en-US, etc)
  };
  action: (args?: string) => Promise<void>;
  description: string;
  icon: string;
}

export const commands: Record<string, VoiceCommand> = {
  navigation: {
    patterns: {
      'pt-BR': [/próxima (história|notícia)/i, /próximo/i],
      'en-US': [/next (story|article)/i, /next/i],
      'es-ES': [/siguiente/i],
      'ja-JP': [/次へ/i, /次の記事/i]
    },
    action: async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
    },
    description: 'Próxima história',
    icon: '📱'
  },

  search: {
    patterns: {
      'pt-BR': [/buscar (.+)/i, /procurar (.+)/i, /pesquisar (.+)/i],
      'en-US': [/search (.+)/i, /search for (.+)/i],
      'es-ES': [/buscar (.+)/i],
      'ja-JP': [/検索(.+)/i]
    },
    action: async (term?: string) => {
      if (!term) return;
      window.dispatchEvent(new CustomEvent('voice-search', { 
        detail: { searchTerm: term }
      }));
    },
    description: 'Pesquisar histórias',
    icon: '🔍'
  },

  theme: {
    patterns: {
      'pt-BR': [/tema (.+)/i, /mudar tema para (.+)/i],
      'en-US': [/theme (.+)/i, /change theme to (.+)/i],
      'es-ES': [/tema (.+)/i],
      'ja-JP': [/テーマ(.+)/i]
    },
    action: async (themeName?: string) => {
      if (!themeName) return;
      window.dispatchEvent(new CustomEvent('change-theme', { 
        detail: { theme: themeName.toLowerCase() }
      }));
    },
    description: 'Mudar tema',
    icon: '🎨'
  },

  save: {
    patterns: {
      'pt-BR': [/salvar/i, /salvar (história|notícia)/i],
      'en-US': [/save/i, /save (story|article)/i],
      'es-ES': [/guardar/i],
      'ja-JP': [/保存/i]
    },
    action: async () => {
      const activeStory = document.querySelector('.story.active');
      if (activeStory) {
        const storyId = activeStory.getAttribute('data-story-id');
        window.dispatchEvent(new CustomEvent('save-story', { 
          detail: { id: storyId }
        }));
      }
    },
    description: 'Salvar história atual',
    icon: '💾'
  },

  read: {
    patterns: {
      'pt-BR': [/ler/i, /ler (história|notícia)/i],
      'en-US': [/read/i, /read (story|article)/i],
      'es-ES': [/leer/i],
      'ja-JP': [/読む/i]
    },
    action: async () => {
      const activeStory = document.querySelector('.story.active');
      if (activeStory) {
        const storyLink = activeStory.querySelector('a[href]') as HTMLAnchorElement;
        if (storyLink) window.open(storyLink.href, '_blank');
      }
    },
    description: 'Abrir história atual',
    icon: '📖'
  },

  filter: {
    patterns: {
      'pt-BR': [/filtrar por (.+)/i, /filtrar (.+)/i],
      'en-US': [/filter (.+)/i, /filter by (.+)/i],
      'es-ES': [/filtrar (.+)/i],
      'ja-JP': [/フィルター(.+)/i]
    },
    action: async (filter?: string) => {
      if (!filter) return;
      window.dispatchEvent(new CustomEvent('apply-filter', { 
        detail: { filter: filter.toLowerCase() }
      }));
    },
    description: 'Filtrar histórias',
    icon: '🏷️'
  },

  mode: {
    patterns: {
      'pt-BR': [/modo (.+)/i],
      'en-US': [/mode (.+)/i],
      'es-ES': [/modo (.+)/i],
      'ja-JP': [/モード(.+)/i]
    },
    action: async (mode?: string) => {
      if (!mode) return;
      window.dispatchEvent(new CustomEvent('change-mode', { 
        detail: { mode: mode.toLowerCase() }
      }));
    },
    description: 'Mudar modo de visualização',
    icon: '🌓'
  },

  scroll: {
    patterns: {
      'pt-BR': [
        /rolar (para )?cima/i,
        /rolar (para )?baixo/i,
        /subir/i,
        /descer/i,
        /voltar ao topo/i,
        /ir para o topo/i
      ],
      'en-US': [/scroll (up|down|top)/i, /back to top/i],
      'es-ES': [/desplazar (arriba|abajo|inicio)/i, /volver al inicio/i],
      'ja-JP': [/スクロール(上|下|トップ)/i]
    },
    action: async (command?: string) => {
      if (!command) return;
      
      // Primeiro verifica se é comando de topo
      if (/(topo|top|inicio|トップ)/i.test(command)) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        showScrollFeedback('⬆️ Voltando ao topo');
        return;
      }

      // Depois verifica a direção (cima/baixo)
      const upPatterns = /(cima|up|arriba|上|subir)/i;
      const downPatterns = /(baixo|down|abajo|下|descer)/i;

      if (upPatterns.test(command)) {
        window.scrollBy({
          top: -500,
          behavior: 'smooth'
        });
        showScrollFeedback('⬆️ Rolando para cima');
      } else if (downPatterns.test(command)) {
        window.scrollBy({
          top: 500,
          behavior: 'smooth'
        });
        showScrollFeedback('⬇️ Rolando para baixo');
      }
    },
    description: 'Rolar página (cima/baixo/topo)',
    icon: '⬆️'
  },

  refresh: {
    patterns: {
      'pt-BR': [/atualizar/i, /recarregar/i],
      'en-US': [/refresh/i, /reload/i],
      'es-ES': [/actualizar/i],
      'ja-JP': [/リロード/i]
    },
    action: async () => {
      window.dispatchEvent(new CustomEvent('refresh-stories'));
    },
    description: 'Recarregar histórias',
    icon: '🔄'
  },

  help: {
    patterns: {
      'pt-BR': [/ajuda/i, /comandos/i],
      'en-US': [/help/i, /commands/i],
      'es-ES': [/ayuda/i],
      'ja-JP': [/ヘルプ/i]
    },
    action: async () => {
      window.dispatchEvent(new CustomEvent('show-commands'));
    },
    description: 'Mostrar comandos',
    icon: '❓'
  }
};