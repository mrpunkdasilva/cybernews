export class AudioFeedback {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isLoaded: boolean = false;

  private soundUrls = {
    activate: '/sounds/activate.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3'
  };

  private async initializeAudio() {
    if (this.isLoaded) return;

    try {
      this.audioContext = new AudioContext();
      
      // Carrega todos os sons
      await Promise.all(
        Object.entries(this.soundUrls).map(async ([name, url]) => {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
          this.sounds.set(name, audioBuffer);
        })
      );

      this.isLoaded = true;
      console.log('Audio feedback initialized successfully');
    } catch (err) {
      console.error('Audio feedback initialization failed:', err);
    }
  }

  async playSound(soundName: string) {
    try {
      if (!this.isLoaded) {
        await this.initializeAudio();
      }

      if (!this.audioContext || !this.sounds.has(soundName)) {
        throw new Error(`Sound ${soundName} not found`);
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds.get(soundName)!;
      source.connect(this.audioContext.destination);
      source.start(0);

      console.log(`Playing sound: ${soundName}`);
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  }
}

export const audioFeedback = new AudioFeedback();