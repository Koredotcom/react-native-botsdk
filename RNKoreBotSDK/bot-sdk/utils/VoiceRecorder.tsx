// Conditional import with error handling
let Voice: any = null;
let Permissions: any = null;

// Lazy load native modules to prevent NativeEventEmitter errors
const loadNativeModules = () => {
  if (Voice && Permissions) {
    return { Voice, Permissions };
  }

  try {
    console.log('Loading voice recognition modules...');
    
    // Try to load the voice module
    const VoiceModule = require('@react-native-voice/voice');
    Voice = VoiceModule?.default || VoiceModule;
    
    if (!Voice) {
      console.warn('Voice module loaded but is null/undefined');
      return { Voice: null, Permissions: null };
    }
    
    // Try to load the permissions module
    const permissionsModule = require('react-native-permissions');
    if (!permissionsModule) {
      console.warn('Permissions module failed to load');
      return { Voice: null, Permissions: null };
    }
    
    Permissions = {
      check: permissionsModule.check,
      request: permissionsModule.request,
      PERMISSIONS: permissionsModule.PERMISSIONS,
      RESULTS: permissionsModule.RESULTS,
    };
    
    // Validate that we have all required permissions properties
    if (!Permissions.check || !Permissions.request || !Permissions.PERMISSIONS || !Permissions.RESULTS) {
      console.warn('Permissions module missing required properties');
      Permissions = null;
      return { Voice: null, Permissions: null };
    }
    
    console.log('Voice recognition modules loaded successfully');
    return { Voice, Permissions };
    
  } catch (error) {
    console.warn('Voice or Permissions module not available:', error);
    Voice = null;
    Permissions = null;
    return { Voice: null, Permissions: null };
  }
};

import {isIOS} from './PlatformCheck';

const DELAY_TIME = 8;

class VoiceHelper {
  timer: any = undefined;
  counter: any = 0;
  private isModulesLoaded = false;
  private Voice: any = null;
  private Permissions: any = null;
  private isVoiceRecognitionAvailable = false;
  private hasTestedAvailability = false;

  constructor(
    onSpeechStart: () => void,
    onSpeechRecognized: () => void,
    onSpeechEnd: () => void,
    onSpeechError: (error: any) => void,
    onSpeechResults: (result: any) => void,
    onSpeechPartialResults: (result: any) => void,
    onSpeechVolumeChanged: (volume: any) => void,
  ) {
    // Initialize native modules lazily
    this.initializeNativeModules();
    
    // Only set up listeners if modules are available
    if (this.Voice && this.isModulesLoaded) {
      try {
        this.Voice.onSpeechStart = onSpeechStart;
        this.Voice.onSpeechRecognized = onSpeechRecognized;
        this.Voice.onSpeechEnd = onSpeechEnd;
        this.Voice.onSpeechError = onSpeechError;
        this.Voice.onSpeechResults = onSpeechResults;
        this.Voice.onSpeechPartialResults = onSpeechPartialResults;
        this.Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
      } catch (error) {
        console.warn('Failed to set up voice listeners:', error);
      }
    }

    this.timer = undefined;
    this.counter = 0;
  }

  private initializeNativeModules() {
    try {
      const modules = loadNativeModules();
      this.Voice = modules.Voice;
      this.Permissions = modules.Permissions;
      this.isModulesLoaded = !!(this.Voice && this.Permissions);
    } catch (error) {
      console.warn('Failed to initialize native modules:', error);
      this.isModulesLoaded = false;
    }
  }

  setTimer = () => {
    this.timer = setInterval(() => {
      // console.log('this.counter ----->:', this.counter);
      if (this.counter >= DELAY_TIME) {
        this.stopRecognizing();
        clearInterval(this.timer);
        this.timer = undefined;
      }
      this.counter++;
    }, 500);
  };

  async requestMicrophonePermission(): Promise<boolean> {
    if (!this.isModulesLoaded || !this.Permissions) {
      console.warn('Permissions module not available');
      return false;
    }

    const permission = isIOS
      ? this.Permissions.PERMISSIONS.IOS.MICROPHONE
      : this.Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO;

    try {
      // Additional null check to prevent TypeError
      if (!this.Permissions) {
        console.warn('Permissions module became unavailable during execution');
        return false;
      }
      
      const result = await this.Permissions.check(permission);
      if (result === this.Permissions.RESULTS.GRANTED) {
        return true;
      } else {
        const requestResult = await this.Permissions.request(permission);
        return requestResult === this.Permissions.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting microphone permission', error);
      return false;
    }
  }

  resetCounter = () => {
    this.counter = 0;
  };

  private async testSpeechRecognitionAvailability(): Promise<boolean> {
    if (this.hasTestedAvailability) {
      return this.isVoiceRecognitionAvailable;
    }

    console.log('Testing speech recognition availability on device...');
    
    try {
      // First, check if modules are available
      if (!this.Voice || !this.isModulesLoaded) {
        console.warn('Voice modules not loaded - speech recognition unavailable');
        this.isVoiceRecognitionAvailable = false;
        this.hasTestedAvailability = true;
        return false;
      }

      // Check permissions first
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        console.warn('Microphone permission denied - speech recognition unavailable');
        this.isVoiceRecognitionAvailable = false;
        this.hasTestedAvailability = true;
        return false;
      }

      // Try a minimal test to see if the Voice module works
      console.log('Performing speech recognition compatibility test...');
      
      // Set a short timeout for the test
      const testPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Speech recognition test timeout'));
        }, 3000);

        // Try to start and immediately stop recognition as a test
        this.Voice.start('en-US', {
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 100,
        }).then(() => {
          clearTimeout(timeout);
          // Immediately stop the test
          return this.Voice.stop();
        }).then(() => {
          resolve(true);
        }).catch((error: any) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      await testPromise;
      
      console.log('Speech recognition compatibility test passed');
      this.isVoiceRecognitionAvailable = true;
      this.hasTestedAvailability = true;
      return true;

    } catch (error) {
      console.warn('Speech recognition compatibility test failed:', error);
      this.isVoiceRecognitionAvailable = false;
      this.hasTestedAvailability = true;
      return false;
    }
  }

  // Method to check if voice recognition is available without running the test again
  public isVoiceRecognitionSupported(): boolean {
    return this.isVoiceRecognitionAvailable;
  }

  // Method to reset the availability test (useful for retrying after app state changes)
  public resetAvailabilityTest(): void {
    this.hasTestedAvailability = false;
    this.isVoiceRecognitionAvailable = false;
  }

  startRecognizing = async () => {
    console.log('Voice recognition requested...');
    
    // Test speech recognition availability first
    const isAvailable = await this.testSpeechRecognitionAvailability();
    if (!isAvailable) {
      console.warn('Speech recognition is not available on this device/configuration');
      // Call the error handler to notify the UI
      try {
        if (this.Voice && typeof this.Voice.onSpeechError === 'function') {
          this.Voice.onSpeechError({ 
            error: 'Speech recognition not available on this device' 
          });
        }
      } catch (error) {
        console.warn('Error calling speech error handler:', error);
      }
      return;
    }

    console.log('Speech recognition is available, starting...');

    try {
      // Since we've already tested that it works, we can start directly
      await this.Voice.start('en-US', {
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 3000,
      });
      
      console.log('Voice recognition started successfully');
      
      if (isIOS) {
        if (!this.timer) {
          this.setTimer();
        }
      }
      
    } catch (error) {
      console.error('Voice recognition failed unexpectedly:', error);
      
      // Mark the feature as unavailable since it failed after passing the test
      this.isVoiceRecognitionAvailable = false;
      
      // Call the error handler
      try {
        if (this.Voice && typeof this.Voice.onSpeechError === 'function') {
          this.Voice.onSpeechError({ 
            error: 'Voice recognition failed to start' 
          });
        }
      } catch (errorHandlerError) {
        console.warn('Error calling speech error handler:', errorHandlerError);
      }
    }
  };

  stopRecognizing = async () => {
    if (!this.isVoiceRecognitionAvailable || !this.Voice) {
      console.warn('Voice recognition not available for stopping');
      return;
    }

    try {
      await this.Voice.stop();
      console.log('Voice recognition stopped successfully');
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  cancelRecognizing = async () => {
    if (!this.isVoiceRecognitionAvailable || !this.Voice) {
      console.warn('Voice recognition not available for canceling');
      return;
    }

    try {
      await this.Voice.cancel();
      console.log('Voice recognition canceled successfully');
    } catch (e) {
      console.error('Error canceling voice recognition:', e);
    }
  };

  destroyRecognizer = async () => {
    if (!this.Voice) {
      return;
    }

    try {
      await this.Voice.destroy();
      this.Voice.removeAllListeners();
      console.log('Voice recognizer destroyed successfully');
    } catch (e) {
      console.error('Error destroying voice recognizer:', e);
    }
  };
}

export default VoiceHelper;
