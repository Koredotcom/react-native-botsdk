import CustomVoiceRecognition from './CustomVoiceRecognition.tsx';
import { Platform } from 'react-native';

let Voice: any = null;
let Permissions: any = null;
let modulesInitialized = false;


const loadNativeModules = () => {
  if (Voice && Permissions && modulesInitialized) {
    return { Voice, Permissions };
  }

  // Reset any previous failed attempts
  Voice = null;
  Permissions = null;

  try {
    if (Platform.OS === 'android') {
      // Use CustomVoiceRecognition for Android
      try {
        const customVoiceInfo = CustomVoiceRecognition.getModuleInfo();
        
        if (customVoiceInfo.available && customVoiceInfo.initialized) {
          Voice = CustomVoiceRecognition;
        } else {
          console.error('[VoiceRecorder] CustomVoiceRecognition not available on Android');
          Voice = null;
        }
      } catch (androidError) {
        console.error('[VoiceRecorder] CustomVoiceRecognition error:', androidError.message || androidError);
        Voice = null;
      }
    } else if (Platform.OS === 'ios') {
      // Use @react-native-voice/voice for iOS
      try {
        const VoiceModule = require('@react-native-voice/voice');
        Voice = VoiceModule?.default || VoiceModule;
        
        if (!Voice) {
          console.error('[VoiceRecorder] Failed to load @react-native-voice/voice for iOS');
          Voice = null;
        }
      } catch (iosError) {
        console.error('[VoiceRecorder] iOS voice module error:', iosError.message || iosError);
        Voice = null;
      }
    } else {
      console.error('[VoiceRecorder] ❌ Unsupported platform:', Platform.OS);
      Voice = null;
    }
    
    // Load permissions module for both platforms
    try {
      const permissionsModule = require('react-native-permissions');
      if (!permissionsModule) {
        console.error('[VoiceRecorder] Permissions module failed to load');
        return { Voice: null, Permissions: null };
      }
      
      Permissions = {
        check: permissionsModule.check,
        request: permissionsModule.request,
        PERMISSIONS: permissionsModule.PERMISSIONS,
        RESULTS: permissionsModule.RESULTS,
      };
      
      // Validate all required methods exist
      const requiredMethods = ['check', 'request', 'PERMISSIONS', 'RESULTS'];
      const missingMethods = requiredMethods.filter(method => !Permissions[method]);
      
      if (missingMethods.length > 0) {
        console.error('[VoiceRecorder] Permissions module missing required properties:', missingMethods);
        Permissions = null;
        return { Voice: null, Permissions: null };
      }
      
    } catch (permissionsError) {
      console.error('[VoiceRecorder] ❌ react-native-permissions error:', permissionsError.message || permissionsError);
      Permissions = null;
      return { Voice: null, Permissions: null };
    }
    
    const finalResult = { Voice, Permissions };
    const isSuccess = !!(Voice && Permissions);
    
    if (isSuccess) {
      modulesInitialized = true;
    }
    
    return finalResult;
    
  } catch (error) {
    console.warn('[VoiceRecorder] Voice or Permissions module not available:', error);
    Voice = null;
    Permissions = null;
    return { Voice: null, Permissions: null };
  }
};

// Platform detection now done via Platform.OS directly

const DELAY_TIME = 8;


class VoiceHelper {
  timer: any = undefined;
  counter: any = 0;
  private isModulesLoaded = false;
  private Voice: any = null;
  private Permissions: any = null;
  private isVoiceRecognitionAvailable = false;
  private hasTestedAvailability = false;
  private isAndroid = false;
  private isIOS = false;

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
        if (this.isAndroid && this.Voice === CustomVoiceRecognition) {
          // Android: Use CustomVoiceRecognition with setEventListeners
          console.log('[VoiceRecorder] Setting up CustomVoiceRecognition listeners for Android');
          this.Voice.setEventListeners({
            onSpeechStart,
            onSpeechRecognized,
            onSpeechEnd,
            onSpeechError,
            onSpeechResults,
            onSpeechPartialResults,
            onSpeechVolumeChanged,
          });
        } else if (this.isIOS) {
          // iOS: Use @react-native-voice/voice with direct property assignment
          console.log('[VoiceRecorder] Setting up @react-native-voice/voice listeners for iOS');
          this.Voice.onSpeechStart = onSpeechStart;
          this.Voice.onSpeechRecognized = onSpeechRecognized;
          this.Voice.onSpeechEnd = onSpeechEnd;
          this.Voice.onSpeechError = onSpeechError;
          this.Voice.onSpeechResults = onSpeechResults;
          this.Voice.onSpeechPartialResults = onSpeechPartialResults;
          this.Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
        } else {
          console.warn('[VoiceRecorder] Unknown voice module type');
        }
      } catch (error) {
        console.warn('[VoiceRecorder] Failed to set up voice listeners:', error);
      }
    }

    this.timer = undefined;
    this.counter = 0;
  }

  private initializeNativeModules() {
    try {
      this.isAndroid = Platform.OS === 'android';
      this.isIOS = Platform.OS === 'ios';
      
      const modules = loadNativeModules();
      this.Voice = modules.Voice;
      this.Permissions = modules.Permissions;
      this.isModulesLoaded = !!(this.Voice && this.Permissions);
      
      if (!this.isModulesLoaded) {
        console.error('[VoiceRecorder] Failed to load voice recognition modules');
        if (!this.Voice) {
          console.error('[VoiceRecorder] Voice module not available');
        }
        if (!this.Permissions) {
          console.error('[VoiceRecorder] Permissions module not available');
        }
      }
      
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Failed to initialize native modules:', error.message || error);
      this.isModulesLoaded = false;
      this.Voice = null;
      this.Permissions = null;
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

    const permission = this.isIOS
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

    console.log(`[VoiceRecorder] Testing speech recognition availability on ${this.isIOS ? 'iOS' : 'Android'}`);

    try {
      if (!this.Voice || !this.isModulesLoaded) {
        console.warn('[VoiceRecorder] Voice module or permissions not loaded');
        this.isVoiceRecognitionAvailable = false;
        this.hasTestedAvailability = true;
        return false;
      }

      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        console.warn('[VoiceRecorder] Microphone permission not granted');
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
        
        if (this.isAndroid && this.Voice === CustomVoiceRecognition) {
          // Android: Use CustomVoiceRecognition
          console.log('[VoiceRecorder] Android: Checking CustomVoiceRecognition availability');
          try {
            const isAvailable = await this.Voice.isAvailable();  
            console.log('[VoiceRecorder] CustomVoiceRecognition available:', isAvailable);
            
            if (!isAvailable) {
              console.warn('[VoiceRecorder] CustomVoiceRecognition reported as unavailable, but proceeding anyway');
              // On Android, sometimes isAvailable() returns false even when it works
              // So we'll assume it's available if we have permissions and methods
            }
          } catch (availabilityError) {
            console.warn('[VoiceRecorder] CustomVoiceRecognition availability check failed, assuming available:', availabilityError);
            // Continue anyway - Android voice recognition can be finicky with availability checks
          }
        } else if (this.isIOS) {
          // iOS: Use @react-native-voice/voice
          console.log('[VoiceRecorder] iOS: Checking @react-native-voice/voice availability');
          if (typeof this.Voice.isAvailable === 'function') {
            const isAvailable = await this.Voice.isAvailable();
            console.log('[VoiceRecorder] @react-native-voice/voice available:', isAvailable);
            if (!isAvailable) {
              throw new Error('@react-native-voice/voice not available on iOS device');
            }
          } else {
            console.log('[VoiceRecorder] iOS: isAvailable method not found, assuming available');
          }
        } else {
          console.warn('[VoiceRecorder] Unknown platform or voice module configuration');
        }
        
        this.isVoiceRecognitionAvailable = true;
        this.hasTestedAvailability = true;
        console.log('[VoiceRecorder] Speech recognition availability test passed');
        return true;
        
      } catch (methodError) {
        console.warn('[VoiceRecorder] Voice availability check failed:', methodError instanceof Error ? methodError.message : String(methodError));
        this.isVoiceRecognitionAvailable = false;
        this.hasTestedAvailability = true;
        return false;
      }

    } catch (error) {
      console.error('[VoiceRecorder] Voice recognition setup failed:', error instanceof Error ? error.message : String(error));
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


  public getVoiceRecognitionStatus(): { available: boolean; reason?: string } {
    if (!this.isModulesLoaded) {
      return { available: false, reason: 'Voice recognition modules not loaded' };
    }
    if (!this.Voice) {
      return { available: false, reason: 'Voice module not available' };
    }
    if (!this.Permissions) {
      return { available: false, reason: 'Permissions module not available' };
    }
    if (!this.isVoiceRecognitionAvailable) {
      return { available: false, reason: 'Voice recognition not available on this device' };
    }
    return { available: true };
  }

  public async debugVoiceRecognition(): Promise<void> {
    console.log('[VoiceRecorder] === VOICE RECOGNITION DEBUG INFO ===');
    console.log(`[VoiceRecorder] Platform: ${this.isIOS ? 'iOS' : 'Android'}`);
    console.log(`[VoiceRecorder] Modules loaded: ${this.isModulesLoaded}`);
    console.log(`[VoiceRecorder] Voice module available: ${!!this.Voice}`);
    console.log(`[VoiceRecorder] Permissions module available: ${!!this.Permissions}`);
    console.log(`[VoiceRecorder] Has tested availability: ${this.hasTestedAvailability}`);
    console.log(`[VoiceRecorder] Voice recognition available: ${this.isVoiceRecognitionAvailable}`);
    
    if (this.Voice) {
      console.log(`[VoiceRecorder] Voice methods available:`);
      console.log(`  - start: ${typeof this.Voice.start}`);
      console.log(`  - stop: ${typeof this.Voice.stop}`);
      console.log(`  - cancel: ${typeof this.Voice.cancel}`);
      console.log(`  - isAvailable: ${typeof this.Voice.isAvailable}`);
      
      try {
        const isAvailable = await this.Voice.isAvailable();
        console.log(`[VoiceRecorder] Voice.isAvailable() result: ${isAvailable}`);
      } catch (error) {
        console.log(`[VoiceRecorder] Voice.isAvailable() error: ${error}`);
      }
    }
    
    if (this.Permissions && !this.isIOS) {
      try {
        const permission = this.Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO;
        const result = await this.Permissions.check(permission);
        console.log(`[VoiceRecorder] Android RECORD_AUDIO permission: ${result}`);
      } catch (error) {
        console.log(`[VoiceRecorder] Android permission check error: ${error}`);
      }
    }
    
    console.log('[VoiceRecorder] === END DEBUG INFO ===');
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
    console.log(`[VoiceRecorder] Starting voice recognition on ${this.isIOS ? 'iOS' : 'Android'}`);
    
    const isAvailable = await this.testSpeechRecognitionAvailability();
    if (!isAvailable) {
      console.warn('[VoiceRecorder] Voice recognition not available');
      try {
        if (this.isAndroid && this.Voice === CustomVoiceRecognition) {
          // CustomVoiceRecognition uses event listeners - error will be sent via events
          console.warn('[VoiceRecorder] CustomVoiceRecognition not available');
        } else if (this.isIOS && this.Voice && this.Voice.onSpeechError) {
          // @react-native-voice/voice - call the error handler if it exists
          if (typeof this.Voice.onSpeechError === 'function') {
            this.Voice.onSpeechError({ 
              error: { message: 'Speech recognition not available on this device' }
            });
          }
        }
      } catch (error) {
        console.error('[VoiceRecorder] Failed to call speech error handler:', error instanceof Error ? error.message : String(error));
      }
      return;
    }

    try {
      // Platform-specific voice recognition options
      let voiceOptions;
      
      if (this.isIOS) {
        // iOS @react-native-voice/voice specific options
        voiceOptions = {
          'ios_category': 'playback',
          'ios_mode': 'measurement',
          'ios_options': [
            'defaultToSpeaker',
            'allowBluetooth',
          ],
          'continuous': true,
          'interimResults': true,
          'partialResults': true,
          'maxAlternatives': 5,
          'showPartial': true,
        };
      } else {
        // Android-specific options
        voiceOptions = {
          EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
          EXTRA_CALLING_PACKAGE: 'com.rnkorebotsdk',
          EXTRA_PARTIAL_RESULTS: true,
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 1500,
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1500,
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 1500,
          EXTRA_MAX_RESULTS: 5,
          EXTRA_WEB_SEARCH_ONLY: false,
        };
      }

      console.log(`[VoiceRecorder] Starting with options:`, voiceOptions);
      
      // Platform-specific pre-start checks
      if (this.isAndroid && this.Voice === CustomVoiceRecognition) {
        try {
          // Check if CustomVoiceRecognition service is available
          const isServiceAvailable = await this.Voice.isAvailable();
          console.log(`[VoiceRecorder] CustomVoiceRecognition service available:`, isServiceAvailable);
          
          if (!isServiceAvailable) {
            throw new Error('CustomVoiceRecognition service not available');
          }
        } catch (serviceError) {
          console.warn('[VoiceRecorder] CustomVoiceRecognition service check failed, proceeding anyway:', serviceError);
        }
      } else if (this.isIOS) {
        // iOS: @react-native-voice/voice doesn't need additional service check
        console.log('[VoiceRecorder] iOS: Using @react-native-voice/voice');
      }
      
      await this.Voice.start('en-US', voiceOptions);
      console.log('[VoiceRecorder] Voice recognition started successfully');
      
      if (this.isIOS) {
        if (!this.timer) {
          this.setTimer();
        }
      }
      
    } catch (error) {
      console.error('[VoiceRecorder] Voice recognition failed to start:', error);
      this.isVoiceRecognitionAvailable = false;
      
      // Provide more detailed error information
      let errorMessage = 'Voice recognition failed to start';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
        
        // Platform-specific error handling
        if (this.isAndroid) {
          if (error.message.includes('RecognitionService') || error.message.includes('initialize')) {
            errorMessage = 'Android speech recognition service not found. Please ensure Google app or speech services are installed.';
          } else if (error.message.includes('permission')) {
            errorMessage = 'Microphone permission denied. Please grant microphone access in Settings.';
          } else if (error.message.includes('network') || error.message.includes('connection')) {
            errorMessage = 'Network connection required for speech recognition. Please check your internet connection.';
          }
        }
      }
      
      try {
        if (this.isAndroid && this.Voice === CustomVoiceRecognition) {
          // CustomVoiceRecognition handles errors via event listeners automatically
          console.warn('[VoiceRecorder] CustomVoiceRecognition error:', errorMessage);
        } else if (this.isIOS && this.Voice && this.Voice.onSpeechError) {
          // @react-native-voice/voice - call the error handler if it exists
          if (typeof this.Voice.onSpeechError === 'function') {
            this.Voice.onSpeechError({ 
              error: { message: errorMessage }
            });
          }
        }
      } catch (errorHandlerError) {
        console.error('[VoiceRecorder] Failed to call speech error handler:', errorHandlerError instanceof Error ? errorHandlerError.message : String(errorHandlerError));
      }
    }
  };

  stopRecognizing = async () => {
    // Clean up timer regardless of voice recognition availability
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    if (!this.isVoiceRecognitionAvailable || !this.Voice) {
      // Silently return without warning - this is a normal case
      // when voice recognition is not available or has been disabled
      return;
    }

    try {
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
