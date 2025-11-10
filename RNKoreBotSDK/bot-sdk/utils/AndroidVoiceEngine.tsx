import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { CustomSpeechRecognizer } = NativeModules;

interface VoiceCallbacks {
  onSpeechStart: () => void;
  onSpeechRecognized: () => void;
  onSpeechEnd: () => void;
  onSpeechError: (error: any) => void;
  onSpeechResults: (result: any) => void;
  onSpeechPartialResults: (result: any) => void;
  onSpeechVolumeChanged: (volume: any) => void;
}

export class AndroidVoiceEngine {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: any[] = [];
  private isInitialized = false;

  constructor(private callbacks: VoiceCallbacks) {
    this.initializeEngine();
  }

  private initializeEngine() {
    if (Platform.OS !== 'android' || !CustomSpeechRecognizer) {
      console.warn('AndroidVoiceEngine: CustomSpeechRecognizer not available');
      return;
    }

    try {
      this.eventEmitter = new NativeEventEmitter(CustomSpeechRecognizer);
      this.setupEventListeners();
      this.isInitialized = true;
    } catch (error) {
      console.error('AndroidVoiceEngine: Failed to initialize', error);
    }
  }

  private setupEventListeners() {
    if (!this.eventEmitter) return;

    const eventMappings = [
      { event: 'onSpeechStart', callback: this.callbacks.onSpeechStart },
      { event: 'onSpeechRecognized', callback: this.callbacks.onSpeechRecognized },
      { event: 'onSpeechEnd', callback: this.callbacks.onSpeechEnd },
      { event: 'onSpeechError', callback: this.callbacks.onSpeechError },
      { event: 'onSpeechResults', callback: this.callbacks.onSpeechResults },
      { event: 'onSpeechPartialResults', callback: this.callbacks.onSpeechPartialResults },
      { event: 'onSpeechVolumeChanged', callback: this.callbacks.onSpeechVolumeChanged },
    ];

    eventMappings.forEach(({ event, callback }) => {
      const listener = this.eventEmitter!.addListener(event, callback);
      this.listeners.push(listener);
    });
  }

  async isAvailable(): Promise<boolean> {
    if (!this.isInitialized || !CustomSpeechRecognizer) {
      return false;
    }

    try {
      return await CustomSpeechRecognizer.isAvailable();
    } catch (error) {
      console.error('AndroidVoiceEngine: Error checking availability', error);
      return false;
    }
  }

  async start(locale: string = 'en-US', options?: any): Promise<void> {
    if (!this.isInitialized || !CustomSpeechRecognizer) {
      throw new Error('AndroidVoiceEngine not initialized');
    }

    try {
      await CustomSpeechRecognizer.startListening(locale);
    } catch (error) {
      console.error('AndroidVoiceEngine: Error starting recognition', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isInitialized || !CustomSpeechRecognizer) {
      return;
    }

    try {
      await CustomSpeechRecognizer.stopListening();
    } catch (error) {
      console.error('AndroidVoiceEngine: Error stopping recognition', error);
      throw error;
    }
  }

  async cancel(): Promise<void> {
    if (!this.isInitialized || !CustomSpeechRecognizer) {
      return;
    }

    try {
      await CustomSpeechRecognizer.cancelListening();
    } catch (error) {
      console.error('AndroidVoiceEngine: Error cancelling recognition', error);
      throw error;
    }
  }

  async destroy(): Promise<void> {
    if (!this.isInitialized || !CustomSpeechRecognizer) {
      return;
    }

    try {
      // Remove event listeners
      this.listeners.forEach(listener => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      });
      this.listeners = [];

      // Destroy native recognizer
      await CustomSpeechRecognizer.destroyRecognizer();
      this.isInitialized = false;
    } catch (error) {
      console.error('AndroidVoiceEngine: Error destroying recognizer', error);
    }
  }

  removeAllListeners(): void {
    this.listeners.forEach(listener => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    });
    this.listeners = [];
  }
}
