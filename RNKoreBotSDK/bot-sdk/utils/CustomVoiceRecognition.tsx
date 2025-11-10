import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { VoiceRecognitionModule } = NativeModules;

interface VoiceRecognitionEvents {
  onSpeechStart?: () => void;
  onSpeechRecognized?: () => void;
  onSpeechEnd?: () => void;
  onSpeechError?: (error: { error: string; code: number }) => void;
  onSpeechResults?: (results: { value: string[] }) => void;
  onSpeechPartialResults?: (results: { value: string[] }) => void;
  onSpeechVolumeChanged?: (volume: { value: number }) => void;
}

class CustomVoiceRecognition {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: { [key: string]: any } = {};
  private isInitialized = false;

  constructor() {
    this.initializeEventEmitter();
  }

  private initializeEventEmitter() {
    try {
      if (Platform.OS === 'android' && VoiceRecognitionModule) {
        this.eventEmitter = new NativeEventEmitter(VoiceRecognitionModule);
        this.isInitialized = true;
        console.log('[CustomVoiceRecognition] Initialized successfully');
      } else {
        console.warn('[CustomVoiceRecognition] Module not available or not on Android');
      }
    } catch (error) {
      console.error('[CustomVoiceRecognition] Initialization failed:', error);
    }
  }

  public isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isInitialized || !VoiceRecognitionModule) {
        console.warn('[CustomVoiceRecognition] Module not initialized');
        resolve(false);
        return;
      }

      VoiceRecognitionModule.isAvailable()
        .then((available: boolean) => {
          console.log('[CustomVoiceRecognition] Availability check result:', available);
          resolve(available);
        })
        .catch((error: any) => {
          console.error('[CustomVoiceRecognition] Availability check failed:', error);
          resolve(false);
        });
    });
  }

  public start(language: string = 'en-US', options: any = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !VoiceRecognitionModule) {
        reject(new Error('Voice recognition module not initialized'));
        return;
      }

      console.log('[CustomVoiceRecognition] Starting voice recognition...');
      
      VoiceRecognitionModule.startListening()
        .then((result: string) => {
          console.log('[CustomVoiceRecognition] Started successfully:', result);
          resolve(result);
        })
        .catch((error: any) => {
          console.error('[CustomVoiceRecognition] Start failed:', error);
          reject(error);
        });
    });
  }

  public stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !VoiceRecognitionModule) {
        reject(new Error('Voice recognition module not initialized'));
        return;
      }

      console.log('[CustomVoiceRecognition] Stopping voice recognition...');
      
      VoiceRecognitionModule.stopListening()
        .then((result: string) => {
          console.log('[CustomVoiceRecognition] Stopped successfully:', result);
          resolve(result);
        })
        .catch((error: any) => {
          console.error('[CustomVoiceRecognition] Stop failed:', error);
          reject(error);
        });
    });
  }

  public cancel(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !VoiceRecognitionModule) {
        reject(new Error('Voice recognition module not initialized'));
        return;
      }

      console.log('[CustomVoiceRecognition] Cancelling voice recognition...');
      
      VoiceRecognitionModule.cancelListening()
        .then((result: string) => {
          console.log('[CustomVoiceRecognition] Cancelled successfully:', result);
          resolve(result);
        })
        .catch((error: any) => {
          console.error('[CustomVoiceRecognition] Cancel failed:', error);
          reject(error);
        });
    });
  }

  public destroy(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !VoiceRecognitionModule) {
        resolve('Module not initialized');
        return;
      }

      console.log('[CustomVoiceRecognition] Destroying voice recognition...');
      
      // Remove all listeners first
      this.removeAllListeners();
      
      VoiceRecognitionModule.destroy()
        .then((result: string) => {
          console.log('[CustomVoiceRecognition] Destroyed successfully:', result);
          this.isInitialized = false;
          resolve(result);
        })
        .catch((error: any) => {
          console.error('[CustomVoiceRecognition] Destroy failed:', error);
          reject(error);
        });
    });
  }

  public setEventListeners(events: VoiceRecognitionEvents) {
    if (!this.eventEmitter) {
      console.warn('[CustomVoiceRecognition] Event emitter not available');
      return;
    }

    // Remove existing listeners
    this.removeAllListeners();

    // Add new listeners
    if (events.onSpeechStart) {
      this.listeners.onSpeechStart = this.eventEmitter.addListener('onSpeechStart', events.onSpeechStart);
    }
    if (events.onSpeechRecognized) {
      this.listeners.onSpeechRecognized = this.eventEmitter.addListener('onSpeechRecognized', events.onSpeechRecognized);
    }
    if (events.onSpeechEnd) {
      this.listeners.onSpeechEnd = this.eventEmitter.addListener('onSpeechEnd', events.onSpeechEnd);
    }
    if (events.onSpeechError) {
      this.listeners.onSpeechError = this.eventEmitter.addListener('onSpeechError', events.onSpeechError);
    }
    if (events.onSpeechResults) {
      this.listeners.onSpeechResults = this.eventEmitter.addListener('onSpeechResults', events.onSpeechResults);
    }
    if (events.onSpeechPartialResults) {
      this.listeners.onSpeechPartialResults = this.eventEmitter.addListener('onSpeechPartialResults', events.onSpeechPartialResults);
    }
    if (events.onSpeechVolumeChanged) {
      this.listeners.onSpeechVolumeChanged = this.eventEmitter.addListener('onSpeechVolumeChanged', events.onSpeechVolumeChanged);
    }

    console.log('[CustomVoiceRecognition] Event listeners set up');
  }

  public removeAllListeners() {
    Object.keys(this.listeners).forEach(key => {
      if (this.listeners[key] && typeof this.listeners[key].remove === 'function') {
        this.listeners[key].remove();
      }
    });
    this.listeners = {};
    console.log('[CustomVoiceRecognition] All listeners removed');
  }

  public getModuleInfo(): { available: boolean; initialized: boolean; platform: string } {
    return {
      available: !!VoiceRecognitionModule,
      initialized: this.isInitialized,
      platform: Platform.OS,
    };
  }
}

// Create a singleton instance
const customVoiceRecognition = new CustomVoiceRecognition();

export default customVoiceRecognition;
