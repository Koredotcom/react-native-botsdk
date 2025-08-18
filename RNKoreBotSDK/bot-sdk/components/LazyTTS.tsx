import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded TTS
export interface TTSModule {
  speak: (text: string, options?: TTSOptions) => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  getInitStatus: () => Promise<string>;
  setDefaultLanguage: (language: string) => Promise<void>;
  setDefaultVoice: (voiceId: string) => Promise<void>;
  setDefaultRate: (rate: number, skipTransform?: boolean) => Promise<void>;
  setDefaultPitch: (pitch: number) => Promise<void>;
  setDucking: (enabled: boolean) => Promise<void>;
  setIgnoreSilentSwitch: (enabled: string) => Promise<void>;
  addEventListener: (type: string, handler: Function) => void;
  removeEventListener: (type: string, handler: Function) => void;
  removeAllListeners: (type: string) => void;
  requestInstallEngine: () => Promise<void>;
  requestInstallData: () => Promise<void>;
  voices: () => Promise<Voice[]>;
  engines: () => Promise<Engine[]>;
}

export interface TTSOptions {
  iosVoiceId?: string;
  rate?: number;
  pitch?: number;
  forceStop?: boolean;
  language?: string;
  quality?: string;
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  quality: string;
  latency: number;
  networkConnectionRequired: boolean;
  notInstalled: boolean;
}

export interface Engine {
  name: string;
  label: string;
  default: boolean;
  icon: number;
}

interface LazyTTSState {
  TTSModule: TTSModule | null;
  isLoading: boolean;
  loadError: string | null;
  isAvailable: boolean;
  hasTestedAvailability: boolean;
}

export interface LazyTTSProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (ttsModule: TTSModule | null) => void;
  onAvailabilityChecked?: (isAvailable: boolean) => void;
}

/**
 * Lazy-loaded TTS component that dynamically imports 
 * react-native-tts only when needed
 */
export class LazyTTS extends Component<LazyTTSProps, LazyTTSState> {
  private mounted = true;

  constructor(props: LazyTTSProps) {
    super(props);
    this.state = {
      TTSModule: null,
      isLoading: false,
      loadError: null,
      isAvailable: false,
      hasTestedAvailability: false,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadTTS();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadTTS() {
    if (this.state.TTSModule || this.state.isLoading) {
      return this.state.TTSModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const TTSModule = await LazyLoader.importModule(
        () => import('react-native-tts'),
        'tts'
      );

      if (this.mounted) {
        // Handle different export patterns
        const TTS = TTSModule?.default || TTSModule || null;

        if (!TTS || !TTS.speak) {
          throw new Error('TTS module or required methods not found');
        }

        // Test availability
        let isAvailable = false;
        try {
          await TTS.getInitStatus();
          isAvailable = true;
        } catch (error) {
          console.warn('TTS availability check failed:', error);
          isAvailable = false;
        }

        this.setState({
          TTSModule: TTS,
          isLoading: false,
          loadError: null,
          isAvailable,
          hasTestedAvailability: true,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(TTS);
        }
        if (this.props.onAvailabilityChecked) {
          this.props.onAvailabilityChecked(isAvailable);
        }

        return TTS;
      }
    } catch (error) {
      console.warn('Failed to load TTS:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          TTSModule: null,
          isLoading: false,
          loadError: errorMessage,
          isAvailable: false,
          hasTestedAvailability: true,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(null);
        }
        if (this.props.onAvailabilityChecked) {
          this.props.onAvailabilityChecked(false);
        }
      }
    }

    return null;
  }

  public async speak(text: string, options?: TTSOptions) {
    const tts = await this.loadTTS();
    if (!tts || !this.state.isAvailable) {
      throw new Error('TTS not available');
    }
    return tts.speak(text, options);
  }

  public async stop() {
    if (!this.state.TTSModule || !this.state.isAvailable) {
      throw new Error('TTS not available');
    }
    return this.state.TTSModule.stop();
  }

  public async pause() {
    if (!this.state.TTSModule || !this.state.isAvailable) {
      throw new Error('TTS not available');
    }
    return this.state.TTSModule.pause();
  }

  public async resume() {
    if (!this.state.TTSModule || !this.state.isAvailable) {
      throw new Error('TTS not available');
    }
    return this.state.TTSModule.resume();
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { TTSModule, isLoading, loadError, isAvailable, hasTestedAvailability } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading text-to-speech..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`TTS unavailable: ${loadError}`} />;
    }

    // Show availability status
    if (hasTestedAvailability && !isAvailable) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>
            Text-to-speech not available on this device
          </Text>
        </View>
      );
    }

    // TTS module loaded successfully
    if (TTSModule && isAvailable) {
      return (
        <View style={styles.availableContainer}>
          <Text style={styles.availableText}>
            Text-to-speech ready
          </Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing text-to-speech..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyTTS = () => {
  const [state, setState] = React.useState<{
    TTSModule: TTSModule | null;
    isLoading: boolean;
    loadError: string | null;
    isAvailable: boolean;
    hasTestedAvailability: boolean;
  }>({
    TTSModule: null,
    isLoading: false,
    loadError: null,
    isAvailable: false,
    hasTestedAvailability: false,
  });

  const loadTTS = React.useCallback(async () => {
    if (state.TTSModule || state.isLoading) {
      return state.TTSModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const TTSModule = await LazyLoader.importModule(
        () => import('react-native-tts'),
        'tts'
      );

      const TTS = TTSModule?.default || TTSModule || null;

      if (!TTS || !TTS.speak) {
        throw new Error('TTS module or required methods not found');
      }

      // Test availability
      let isAvailable = false;
      try {
        await TTS.getInitStatus();
        isAvailable = true;
      } catch (error) {
        console.warn('TTS availability check failed:', error);
        isAvailable = false;
      }

      setState({
        TTSModule: TTS,
        isLoading: false,
        loadError: null,
        isAvailable,
        hasTestedAvailability: true,
      });

      return TTS;
    } catch (error) {
      console.warn('Failed to load TTS:', error);
      setState({
        TTSModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
        isAvailable: false,
        hasTestedAvailability: true,
      });
      return null;
    }
  }, [state.TTSModule, state.isLoading]);

  const speak = React.useCallback(async (text: string, options?: TTSOptions) => {
    const tts = await loadTTS();
    if (!tts || !state.isAvailable) {
      throw new Error('TTS not available');
    }
    return tts.speak(text, options);
  }, [loadTTS, state.isAvailable]);

  const stop = React.useCallback(async () => {
    if (!state.TTSModule || !state.isAvailable) {
      throw new Error('TTS not available');
    }
    return state.TTSModule.stop();
  }, [state.TTSModule, state.isAvailable]);

  React.useEffect(() => {
    loadTTS();
  }, [loadTTS]);

  return {
    TTSModule: state.TTSModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    isAvailable: state.isAvailable,
    hasTestedAvailability: state.hasTestedAvailability,
    loadTTS,
    speak,
    stop,
  };
};

/**
 * Simple fallback TTS component
 * This can be used when TTS is not available
 */
export const FallbackTTS: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError('Text-to-speech not available on this device');
    }
  }, [onError]);

  const handlePress = () => {
    Alert.alert(
      'Text-to-Speech Unavailable',
      'Text-to-speech is not available on this device or platform.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>
        Text-to-speech not supported
      </Text>
      <Text style={styles.fallbackSubText}>
        This feature requires device support for speech synthesis
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  availableContainer: {
    padding: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableText: {
    fontSize: 14,
    color: '#2e7d2e',
    fontWeight: '500',
  },
  unavailableContainer: {
    padding: 16,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
  },
  fallbackContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackSubText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default LazyTTS;
