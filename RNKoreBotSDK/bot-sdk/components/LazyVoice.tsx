import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Voice
export interface VoiceEvents {
  onSpeechStart?: () => void;
  onSpeechRecognized?: () => void;
  onSpeechEnd?: () => void;
  onSpeechError?: (error: any) => void;
  onSpeechResults?: (result: any) => void;
  onSpeechPartialResults?: (result: any) => void;
  onSpeechVolumeChanged?: (volume: any) => void;
}

export interface VoiceModule extends VoiceEvents {
  start: (locale?: string, options?: any) => Promise<void>;
  stop: () => Promise<void>;
  cancel: () => Promise<void>;
  destroy: () => Promise<void>;
  removeAllListeners: () => void;
  isAvailable: () => Promise<boolean>;
  getSpeechRecognitionServices: () => Promise<string[]>;
}

interface LazyVoiceState {
  VoiceModule: VoiceModule | null;
  isLoading: boolean;
  loadError: string | null;
  isAvailable: boolean;
  hasTestedAvailability: boolean;
}

export interface LazyVoiceProps extends VoiceEvents {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (voiceModule: VoiceModule | null) => void;
  onAvailabilityChecked?: (isAvailable: boolean) => void;
}

/**
 * Lazy-loaded Voice component that dynamically imports 
 * @react-native-voice/voice only when needed
 */
export class LazyVoice extends Component<LazyVoiceProps, LazyVoiceState> {
  private mounted = true;

  constructor(props: LazyVoiceProps) {
    super(props);
    this.state = {
      VoiceModule: null,
      isLoading: false,
      loadError: null,
      isAvailable: false,
      hasTestedAvailability: false,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadVoice();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cleanup();
  }

  private async cleanup() {
    if (this.state.VoiceModule) {
      try {
        await this.state.VoiceModule.destroy();
        this.state.VoiceModule.removeAllListeners();
      } catch (error) {
        console.warn('Error during Voice cleanup:', error);
      }
    }
  }

  public async loadVoice() {
    if (this.state.VoiceModule || this.state.isLoading) {
      return this.state.VoiceModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const VoiceModule = await LazyLoader.importModule(
        () => import('@react-native-voice/voice'),
        'voice'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Voice = VoiceModule?.default || VoiceModule || null;

        if (!Voice) {
          throw new Error('Voice module not found');
        }

        // Set up event listeners
        if (this.props.onSpeechStart) Voice.onSpeechStart = this.props.onSpeechStart;
        if (this.props.onSpeechRecognized) Voice.onSpeechRecognized = this.props.onSpeechRecognized;
        if (this.props.onSpeechEnd) Voice.onSpeechEnd = this.props.onSpeechEnd;
        if (this.props.onSpeechError) Voice.onSpeechError = this.props.onSpeechError;
        if (this.props.onSpeechResults) Voice.onSpeechResults = this.props.onSpeechResults;
        if (this.props.onSpeechPartialResults) Voice.onSpeechPartialResults = this.props.onSpeechPartialResults;
        if (this.props.onSpeechVolumeChanged) Voice.onSpeechVolumeChanged = this.props.onSpeechVolumeChanged;

        // Test availability
        let isAvailable = false;
        try {
          isAvailable = await Voice.isAvailable();
        } catch (error) {
          console.warn('Voice availability check failed:', error);
          isAvailable = false;
        }

        this.setState({
          VoiceModule: Voice,
          isLoading: false,
          loadError: null,
          isAvailable,
          hasTestedAvailability: true,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Voice);
        }
        if (this.props.onAvailabilityChecked) {
          this.props.onAvailabilityChecked(isAvailable);
        }

        return Voice;
      }
    } catch (error) {
      console.warn('Failed to load Voice:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          VoiceModule: null,
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

  public async startRecognizing(locale: string = 'en-US', options?: any) {
    const voice = await this.loadVoice();
    if (!voice || !this.state.isAvailable) {
      throw new Error('Voice recognition not available');
    }
    return voice.start(locale, options);
  }

  public async stopRecognizing() {
    if (!this.state.VoiceModule || !this.state.isAvailable) {
      throw new Error('Voice recognition not available');
    }
    return this.state.VoiceModule.stop();
  }

  public async cancelRecognizing() {
    if (!this.state.VoiceModule || !this.state.isAvailable) {
      throw new Error('Voice recognition not available');
    }
    return this.state.VoiceModule.cancel();
  }

  public async getSpeechRecognitionServices() {
    const voice = await this.loadVoice();
    if (!voice) {
      return [];
    }
    try {
      return await voice.getSpeechRecognitionServices();
    } catch (error) {
      console.warn('Failed to get speech recognition services:', error);
      return [];
    }
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { VoiceModule, isLoading, loadError, isAvailable, hasTestedAvailability } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading voice recognition..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`Voice recognition unavailable: ${loadError}`} />;
    }

    // Show availability status
    if (hasTestedAvailability && !isAvailable) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>
            Voice recognition not available on this device
          </Text>
        </View>
      );
    }

    // Voice module loaded successfully
    if (VoiceModule && isAvailable) {
      return (
        <View style={styles.availableContainer}>
          <Text style={styles.availableText}>
            Voice recognition ready
          </Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing voice recognition..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyVoice = (events: VoiceEvents = {}) => {
  const [state, setState] = React.useState<{
    VoiceModule: VoiceModule | null;
    isLoading: boolean;
    loadError: string | null;
    isAvailable: boolean;
    hasTestedAvailability: boolean;
  }>({
    VoiceModule: null,
    isLoading: false,
    loadError: null,
    isAvailable: false,
    hasTestedAvailability: false,
  });

  const loadVoice = React.useCallback(async () => {
    if (state.VoiceModule || state.isLoading) {
      return state.VoiceModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const VoiceModule = await LazyLoader.importModule(
        () => import('@react-native-voice/voice'),
        'voice'
      );

      const Voice = VoiceModule?.default || VoiceModule || null;

      if (!Voice) {
        throw new Error('Voice module not found');
      }

      // Set up event listeners
      if (events.onSpeechStart) Voice.onSpeechStart = events.onSpeechStart;
      if (events.onSpeechRecognized) Voice.onSpeechRecognized = events.onSpeechRecognized;
      if (events.onSpeechEnd) Voice.onSpeechEnd = events.onSpeechEnd;
      if (events.onSpeechError) Voice.onSpeechError = events.onSpeechError;
      if (events.onSpeechResults) Voice.onSpeechResults = events.onSpeechResults;
      if (events.onSpeechPartialResults) Voice.onSpeechPartialResults = events.onSpeechPartialResults;
      if (events.onSpeechVolumeChanged) Voice.onSpeechVolumeChanged = events.onSpeechVolumeChanged;

      // Test availability
      let isAvailable = false;
      try {
        isAvailable = await Voice.isAvailable();
      } catch (error) {
        console.warn('Voice availability check failed:', error);
        isAvailable = false;
      }

      setState({
        VoiceModule: Voice,
        isLoading: false,
        loadError: null,
        isAvailable,
        hasTestedAvailability: true,
      });

      return Voice;
    } catch (error) {
      console.warn('Failed to load Voice:', error);
      setState({
        VoiceModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
        isAvailable: false,
        hasTestedAvailability: true,
      });
      return null;
    }
  }, [state.VoiceModule, state.isLoading, events]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (state.VoiceModule) {
        state.VoiceModule.destroy().catch(console.warn);
        state.VoiceModule.removeAllListeners();
      }
    };
  }, [state.VoiceModule]);

  const startRecognizing = React.useCallback(async (locale: string = 'en-US', options?: any) => {
    const voice = await loadVoice();
    if (!voice || !state.isAvailable) {
      throw new Error('Voice recognition not available');
    }
    return voice.start(locale, options);
  }, [loadVoice, state.isAvailable]);

  const stopRecognizing = React.useCallback(async () => {
    if (!state.VoiceModule || !state.isAvailable) {
      throw new Error('Voice recognition not available');
    }
    return state.VoiceModule.stop();
  }, [state.VoiceModule, state.isAvailable]);

  const cancelRecognizing = React.useCallback(async () => {
    if (!state.VoiceModule || !state.isAvailable) {
      throw new Error('Voice recognition not available');
    }
    return state.VoiceModule.cancel();
  }, [state.VoiceModule, state.isAvailable]);

  return {
    VoiceModule: state.VoiceModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    isAvailable: state.isAvailable,
    hasTestedAvailability: state.hasTestedAvailability,
    loadVoice,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
  };
};

/**
 * Simple fallback Voice component
 * This can be used when voice recognition is not available
 */
export const FallbackVoice: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError('Voice recognition not available on this device');
    }
  }, [onError]);

  const handlePress = () => {
    Alert.alert(
      'Voice Recognition Unavailable',
      'Voice recognition is not available on this device or platform.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>
        Voice recognition not supported
      </Text>
      <Text style={styles.fallbackSubText}>
        This feature requires device support for speech recognition
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

export default LazyVoice;
