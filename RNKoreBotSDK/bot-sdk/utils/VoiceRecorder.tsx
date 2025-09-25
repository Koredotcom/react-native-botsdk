let Voice: any = null;
let Permissions: any = null;

const loadNativeModules = () => {
  if (Voice && Permissions) {
    return { Voice, Permissions };
  }

  try {
    const VoiceModule = require('@react-native-voice/voice');
    Voice = VoiceModule?.default || VoiceModule;
    
    if (!Voice) {
      console.warn('Voice module loaded but is null/undefined');
      return { Voice: null, Permissions: null };
    }
    
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
    
    if (!Permissions.check || !Permissions.request || !Permissions.PERMISSIONS || !Permissions.RESULTS) {
      console.warn('Permissions module missing required properties');
      Permissions = null;
      return { Voice: null, Permissions: null };
    }
    
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
    this.initializeNativeModules();
    
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

    try {
      if (!this.Voice || !this.isModulesLoaded) {
        this.isVoiceRecognitionAvailable = false;
        this.hasTestedAvailability = true;
        return false;
      }

      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        this.isVoiceRecognitionAvailable = false;
        this.hasTestedAvailability = true;
        return false;
      }

      try {
        const hasRequiredMethods = 
          typeof this.Voice.start === 'function' &&
          typeof this.Voice.stop === 'function' &&
          typeof this.Voice.cancel === 'function';
        
        if (!hasRequiredMethods) {
          throw new Error('Voice module missing required methods');
        }
        
        const isAvailable = await this.Voice.isAvailable();
        if (!isAvailable) {
          throw new Error('Speech recognition not available on device');
        }
        
        this.isVoiceRecognitionAvailable = true;
        this.hasTestedAvailability = true;
        return true;
        
      } catch (methodError) {
        console.warn('Voice availability check failed, assuming available:', methodError instanceof Error ? methodError.message : String(methodError));
        this.isVoiceRecognitionAvailable = true;
        this.hasTestedAvailability = true;
        return true;
      }

    } catch (error) {
      console.error('Voice recognition setup failed:', error instanceof Error ? error.message : String(error));
      this.isVoiceRecognitionAvailable = false;
      this.hasTestedAvailability = true;
      return false;
    }
  }

  public isVoiceRecognitionSupported(): boolean {
    return this.isVoiceRecognitionAvailable;
  }

  public resetAvailabilityTest(): void {
    this.hasTestedAvailability = false;
    this.isVoiceRecognitionAvailable = false;
  }

  public resetVoiceState = async (): Promise<void> => {
    try {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
      
      this.counter = 0;
      
      if (this.Voice && this.isVoiceRecognitionAvailable) {
        try {
          await this.Voice.cancel();
        } catch (error) {
          console.warn('Failed to cancel voice recognition during reset:', error instanceof Error ? error.message : String(error));
        }
      }
    } catch (error) {
      console.error('Voice state reset failed:', error instanceof Error ? error.message : String(error));
    }
  };

  startRecognizing = async () => {
    const isAvailable = await this.testSpeechRecognitionAvailability();
    if (!isAvailable) {
      try {
        if (this.Voice && typeof this.Voice.onSpeechError === 'function') {
          this.Voice.onSpeechError({ 
            error: 'Speech recognition not available on this device' 
          });
        }
      } catch (error) {
        console.error('Failed to call speech error handler:', error instanceof Error ? error.message : String(error));
      }
      return;
    }

    try {
      await this.Voice.start('en-US', {
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 1000,
      });
      
      if (isIOS) {
        if (!this.timer) {
          this.setTimer();
        }
      }
      
    } catch (error) {
      this.isVoiceRecognitionAvailable = false;
      
      try {
        if (this.Voice && typeof this.Voice.onSpeechError === 'function') {
          this.Voice.onSpeechError({ 
            error: 'Voice recognition failed to start' 
          });
        }
      } catch (errorHandlerError) {
        console.error('Failed to call speech error handler:', errorHandlerError instanceof Error ? errorHandlerError.message : String(errorHandlerError));
      }
    }
  };

  stopRecognizing = async () => {
    if (!this.isVoiceRecognitionAvailable || !this.Voice) {
      console.warn('Voice recognition not available for stopping');
      return;
    }

    try {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
      
      await this.Voice.stop();
    } catch (e) {
      console.error('Error stopping voice recognition:', e instanceof Error ? e.message : String(e));
      
      try {
        await this.Voice.cancel();
        console.log('Voice recognition cancelled after stop failure');
      } catch (cancelError) {
        console.error('Failed to cancel voice recognition:', cancelError instanceof Error ? cancelError.message : String(cancelError));
      }
    }
  };

  cancelRecognizing = async () => {
    if (!this.isVoiceRecognitionAvailable || !this.Voice) {
      console.warn('Voice recognition not available for canceling');
      return;
    }

    try {
      await this.Voice.cancel();
    } catch (e) {
      console.error('Error canceling voice recognition:', e instanceof Error ? e.message : String(e));
    }
  };

  destroyRecognizer = async () => {
    if (!this.Voice) {
      return;
    }

    try {
      await this.Voice.destroy();
      this.Voice.removeAllListeners();
    } catch (e) {
      console.error('Error destroying voice recognizer:', e instanceof Error ? e.message : String(e));
    }
  };
}

export default VoiceHelper;
