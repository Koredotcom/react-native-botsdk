import Voice from '@react-native-voice/voice';
import {Alert, Platform} from 'react-native';

export interface SpeechRecognitionResult {
  success: boolean;
  transcript?: string;
  error?: string;
}

class SpeechRecognitionService {
  private isListening: boolean = false;
  private resultsCallback?: (result: SpeechRecognitionResult) => void;

  constructor() {
    this.setupVoiceEvents();
  }

  private setupVoiceEvents() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResultsHandler;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
  }

  private onSpeechStart = () => {
    console.log('Speech recognition started');
  };

  private onSpeechRecognized = () => {
    console.log('Speech recognized');
  };

  private onSpeechEnd = () => {
    console.log('Speech recognition ended');
    this.isListening = false;
  };

  private onSpeechError = (error: any) => {
    console.log('Speech recognition error:', error);
    this.isListening = false;
    
    let errorMessage = 'Speech recognition failed';
    if (error?.error) {
      switch (error.error.code) {
        case '7': // ERROR_NO_MATCH
          errorMessage = 'No speech input detected';
          break;
        case '8': // ERROR_RECOGNIZER_BUSY
          errorMessage = 'Speech recognizer is busy';
          break;
        case '9': // ERROR_INSUFFICIENT_PERMISSIONS
          errorMessage = 'Microphone permission denied';
          break;
        default:
          errorMessage = error.error.message || errorMessage;
      }
    }
    
    this.resultsCallback?.({
      success: false,
      error: errorMessage,
    });
  };

  private onSpeechResultsHandler = (event: any) => {
    console.log('Speech results:', event);
    const transcript = event.value?.[0] || '';
    
    this.resultsCallback?.({
      success: true,
      transcript,
    });
  };

  private onSpeechPartialResults = (event: any) => {
    console.log('Partial speech results:', event);
    // Handle partial results if needed
  };

  async checkAvailability(): Promise<boolean> {
    try {
      // Check if Voice is available and properly initialized
      if (!Voice) {
        console.log('Voice module not available');
        return false;
      }

      // For iOS simulator, speech recognition is typically not available
      if (Platform.OS === 'ios' && __DEV__) {
        console.log('Speech recognition may not work on iOS simulator');
        // Still return true to allow testing, but handle errors gracefully
      }

      const isAvailable = await Voice.isAvailable();
      console.log('Speech recognition available:', isAvailable);
      return !!isAvailable;
    } catch (error) {
      console.log('Error checking speech availability:', error);
      return false;
    }
  }

  async startListening(onResults: (result: SpeechRecognitionResult) => void): Promise<boolean> {
    try {
      if (this.isListening) {
        console.log('Already listening');
        return false;
      }

      const isAvailable = await this.checkAvailability();
      if (!isAvailable) {
        onResults({
          success: false,
          error: 'Speech recognition is not available on this device',
        });
        return false;
      }

      this.resultsCallback = onResults;
      
      await Voice.start('en-US');
      this.isListening = true;
      console.log('Started listening');
      return true;
    } catch (error: any) {
      console.log('Error starting speech recognition:', error);
      this.isListening = false;
      
      onResults({
        success: false,
        error: error.message || 'Failed to start speech recognition',
      });
      return false;
    }
  }

  async stopListening(): Promise<void> {
    try {
      if (this.isListening) {
        await Voice.stop();
        this.isListening = false;
        console.log('Stopped listening');
      }
    } catch (error) {
      console.log('Error stopping speech recognition:', error);
      this.isListening = false;
    }
  }

  async destroyRecognizer(): Promise<void> {
    try {
      await Voice.destroy();
      this.isListening = false;
      console.log('Voice recognizer destroyed');
    } catch (error) {
      console.log('Error destroying voice recognizer:', error);
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Export a singleton instance
export const speechRecognitionService = new SpeechRecognitionService(); 