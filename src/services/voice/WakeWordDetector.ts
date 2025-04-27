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
        'hey ciber'
      ],
      fuzzyMatch: true,
      sensitivity: 0.8
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
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1 === str2) return 1;
    if (str1.includes(str2) || str2.includes(str1)) return 0.9;

    let matches = 0;
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');

    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2) matches++;
        else if (this.levenshteinDistance(word1, word2) <= 2) matches += 0.5;
      }
    }

    return matches / Math.max(words1.length, words2.length);
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

  detectWakeWord(transcript: string, lang: string = 'pt-BR'): boolean {
    if (!transcript) return false;

    const now = Date.now();
    if (now - this.lastActivationTime < this.MIN_ACTIVATION_INTERVAL) {
      console.log('Activation attempted too soon after last activation');
      return false;
    }

    const config = this.wakeWords.get(lang) || this.wakeWords.get('en-US')!;
    const normalizedTranscript = transcript.toLowerCase().trim();

    console.log('Checking wake word in transcript:', normalizedTranscript);
    console.log('Available wake words for', lang, ':', config.phrases);

    for (const phrase of config.phrases) {
      let matched = false;
      let matchScore = 0;

      if (config.fuzzyMatch) {
        matchScore = this.fuzzyMatch(normalizedTranscript, phrase);
        matched = matchScore >= (config.sensitivity || 0.8);
      } else {
        matched = normalizedTranscript.includes(phrase.toLowerCase());
      }

      if (matched) {
        console.log('Wake word detected:', phrase, 'with score:', matchScore);
        
        if (this.shouldActivate()) {
          this.activate();
          return true;
        } else {
          console.log('Activation prevented due to rate limiting');
          return false;
        }
      }
    }

    return false;
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