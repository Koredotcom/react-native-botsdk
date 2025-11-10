import { Platform } from 'react-native';

interface VoiceCallbacks {
  onSpeechStart: () => void;
  onSpeechRecognized: () => void;
  onSpeechEnd: () => void;
  onSpeechError: (error: any) => void;
  onSpeechResults: (result: any) => void;
  onSpeechPartialResults: (result: any) => void;
  onSpeechVolumeChanged: (volume: any) => void;
}

export class IOSVoiceEngine {
  private Voice: any = null;
  private isInitialized = false;

  constructor(private callbacks: VoiceCallbacks) {
    this.initializeEngine();
  }

  private initializeEngine() {
    if (Platform.OS !== 'ios') {
      console.warn('IOSVoiceEngine: Not running on iOS platform');
      return;
    }

    try {
      // Load the existing @react-native-voice/voice module
      const VoiceModule = require('@react-native-voice/voice');
      this.Voice = VoiceModule?.default || VoiceModule;
      
      if (!this.Voice) {
        console.warn('IOSVoiceEngine: Voice module loaded but is null/undefined');
        return;
      }

      // Set up event listeners using the existing Voice module
      this.Voice.onSpeechStart = this.callbacks.onSpeechStart;
      this.Voice.onSpeechRecognized = this.callbacks.onSpeechRecognized;
      this.Voice.onSpeechEnd = this.callbacks.onSpeechEnd;
      this.Voice.onSpeechError = this.callbacks.onSpeechError;
      this.Voice.onSpeechResults = this.callbacks.onSpeechResults;
      this.Voice.onSpeechPartialResults = this.callbacks.onSpeechPartialResults;
      this.Voice.onSpeechVolumeChanged = this.callbacks.onSpeechVolumeChanged;

      this.isInitialized = true;
    } catch (error) {
      console.error('IOSVoiceEngine: Failed to initialize', error);
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.isInitialized || !this.Voice) {
      return false;
    }

    try {
      return await this.Voice.isAvailable();
    } catch (error) {
      console.error('IOSVoiceEngine: Error checking availability', error);
      return false;
    }
  }

  async start(locale: string = 'en-US', options?: any): Promise<void> {
    if (!this.isInitialized || !this.Voice) {
      throw new Error('IOSVoiceEngine not initialized');
    }

    try {
      const voiceOptions = {
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 1000,
        ...options
      };

      await this.Voice.start(locale, voiceOptions);
    } catch (error) {
      console.error('IOSVoiceEngine: Error starting recognition', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isInitialized || !this.Voice) {
      return;
    }

    try {
      await this.Voice.stop();
    } catch (error) {
      console.error('IOSVoiceEngine: Error stopping recognition', error);
      throw error;
    }
  }

  async cancel(): Promise<void> {
    if (!this.isInitialized || !this.Voice) {
      return;
    }

    try {
      await this.Voice.cancel();
    } catch (error) {
      console.error('IOSVoiceEngine: Error cancelling recognition', error);
      throw error;
    }
  }

  async destroy(): Promise<void> {
    if (!this.isInitialized || !this.Voice) {
      return;
    }

    try {
      await this.Voice.destroy();
      this.Voice.removeAllListeners();
      this.isInitialized = false;
    } catch (error) {
      console.error('IOSVoiceEngine: Error destroying recognizer', error);
    }
  }

  removeAllListeners(): void {
    if (this.Voice && typeof this.Voice.removeAllListeners === 'function') {
      this.Voice.removeAllListeners();
    }
  }
}
