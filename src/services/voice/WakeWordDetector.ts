interface WakeWordConfig {
  phrases: string[];
  fuzzyMatch?: boolean;
  sensitivity?: number;
}

export class WakeWordDetector {
  private wakeWords: Map<string, WakeWordConfig> = new Map([
    ['pt-BR', {
      phrases: [
        'hey cyber',
        'ei cyber',
        'ok cyber',
        'cyber',
        'ei ciber',
        'ok ciber',
        'ciber',
        'hey ciber',
        'iniciar',
        'começar',
        'assistente',
        'buscar',           // Adicionando buscar como wake word
        'buscar por',       // Variação comum
        'procurar',         // Sinônimo
        'procurar por',     // Variação comum
        'pesquisar',        // Sinônimo
        'pesquisar por'     // Variação comum
      ],
      fuzzyMatch: true,
      sensitivity: 0.6  // Reduzindo a sensibilidade para aceitar mais variações
    }],
    ['en-US', {
      phrases: [
        'hey cyber',
        'ok cyber',
        'cyber',
        'hey assistant',
        'cyber news'
      ],
      fuzzyMatch: true,
      sensitivity: 0.8
    }],
    ['es-ES', {
      phrases: [
        'oye cyber',
        'hey cyber',
        'cyber',
        'oye ciber',
        'hola cyber',
        'hola ciber'
      ],
      fuzzyMatch: true,
      sensitivity: 0.8
    }],
    ['ja-JP', {
      phrases: [
        'サイバー',
        'hey cyber',
        'cyber',
        'はい サイバー',
        'オーケー サイバー'
      ],
      fuzzyMatch: false,
      sensitivity: 0.9
    }]
  ]);

  private isActivated: boolean = false;
  private timeoutId: NodeJS.Timeout | null = null;
  private lastActivationTime: number = 0;
  private consecutiveActivations: number = 0;
  private readonly MIN_ACTIVATION_INTERVAL = 1000; // 1 segundo
  private readonly MAX_CONSECUTIVE_ACTIVATIONS = 3;

  constructor(
    private readonly timeoutDuration: number = 10000,
    private readonly cooldownPeriod: number = 30000
  ) {}

  private fuzzyMatch(str1: string, str2: string): number {
    // Normaliza as strings removendo acentos e convertendo para minúsculas
    const normalize = (str: string) => str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const normalized1 = normalize(str1);
    const normalized2 = normalize(str2);

    // Verifica inclusão direta
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return 0.9;
    }

    // Divide em palavras e verifica cada uma
    const words1 = normalized1.split(/\s+/);
    const words2 = normalized2.split(/\s+/);

    let matches = 0;
    let totalWords = Math.max(words1.length, words2.length);

    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2) {
          matches += 1;
        } else if (this.levenshteinDistance(word1, word2) <= 2) {
          matches += 0.7;
        } else if (word1.includes(word2) || word2.includes(word1)) {
          matches += 0.8;
        }
      }
    }

    return matches / totalWords;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i-1] === str2[j-1]) {
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i-1][j-1] + 1,
            matrix[i][j-1] + 1,
            matrix[i-1][j] + 1
          );
        }
      }
    }

    return matrix[str1.length][str2.length];
  }

  detectWakeWord(transcript: string, lang: string = 'pt-BR'): { activated: boolean; isSearchCommand: boolean } {
    if (!transcript) return { activated: false, isSearchCommand: false };

    const config = this.wakeWords.get(lang) || this.wakeWords.get('en-US')!;
    const normalizedTranscript = transcript.toLowerCase().trim();

    console.log('Transcript recebido:', transcript);
    console.log('Transcript normalizado:', normalizedTranscript);

    for (const phrase of config.phrases) {
      let matched = false;
      let matchScore = 0;

      if (config.fuzzyMatch) {
        matchScore = this.fuzzyMatch(normalizedTranscript, phrase);
        matched = matchScore >= (config.sensitivity || 0.6);
        
        console.log(`Comparando com "${phrase}":`, {
          matchScore,
          threshold: config.sensitivity,
          matched
        });
      } else {
        matched = normalizedTranscript.includes(phrase.toLowerCase());
      }

      if (matched) {
        console.log('Wake word detectada:', phrase, 'com score:', matchScore);
        const isSearchCommand = ['buscar', 'buscar por', 'procurar', 'procurar por', 'pesquisar', 'pesquisar por'].includes(phrase);
        return { 
          activated: this.shouldActivate(), 
          isSearchCommand 
        };
      }
    }

    return { activated: false, isSearchCommand: false };
  }

  private shouldActivate(): boolean {
    const now = Date.now();
    
    // Reset consecutive activations if cooldown period has passed
    if (now - this.lastActivationTime > this.cooldownPeriod) {
      this.consecutiveActivations = 0;
    }

    return this.consecutiveActivations < this.MAX_CONSECUTIVE_ACTIVATIONS;
  }

  activate(): void {
    const now = Date.now();
    this.isActivated = true;
    this.lastActivationTime = now;
    this.consecutiveActivations++;

    console.log('Wake word detector activated');
    console.log('Consecutive activations:', this.consecutiveActivations);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      console.log('Wake word detector timeout');
      this.deactivate();
    }, this.timeoutDuration);
  }

  isActive(): boolean {
    return this.isActivated;
  }

  deactivate(): void {
    console.log('Wake word detector deactivated');
    this.isActivated = false;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset(): void {
    this.deactivate();
    this.consecutiveActivations = 0;
    this.lastActivationTime = 0;
  }
}