import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Sound module
export interface SoundModule {
  new (filename: string, basePath: string, onError?: (error: any) => void, options?: any): SoundInstance;
  MAIN_BUNDLE: string;
  DOCUMENT: string;
  LIBRARY: string;
  CACHES: string;
  setCategory: (category: string, mixWithOthers?: boolean) => void;
  getCategory: (callback: (category: string, mixWithOthers: boolean) => void) => void;
  setMode: (mode: string) => void;
  getMode: (callback: (mode: string) => void) => void;
  setSpeakerphoneOn: (speaker: boolean) => void;
  setActive: (active: boolean) => void;
  isWiredHeadsetPluggedIn: (callback: (pluggedIn: boolean) => void) => void;
}

export interface SoundInstance {
  play: (callback?: (success: boolean) => void) => void;
  pause: (callback?: () => void) => void;
  stop: (callback?: () => void) => void;
  reset: () => void;
  release: () => void;
  getDuration: () => number;
  getCurrentTime: (callback: (seconds: number, isPlaying: boolean) => void) => void;
  setCurrentTime: (seconds: number) => void;
  setVolume: (volume: number) => void;
  getVolume: (callback: (volume: number) => void) => void;
  setNumberOfLoops: (loops: number) => void;
  getNumberOfLoops: (callback: (loops: number) => void) => void;
  setPan: (pan: number) => void;
  getPan: (callback: (pan: number) => void) => void;
  setSpeed: (speed: number) => void;
  getSpeed: (callback: (speed: number) => void) => void;
  isLoaded: () => boolean;
  isPlaying: () => boolean;
}

interface LazySoundState {
  SoundModule: SoundModule | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazySoundProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (soundModule: SoundModule | null) => void;
}

/**
 * Lazy-loaded Sound component that dynamically imports 
 * react-native-sound only when needed
 */
export class LazySound extends Component<LazySoundProps, LazySoundState> {
  private mounted = true;

  constructor(props: LazySoundProps) {
    super(props);
    this.state = {
      SoundModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadSound();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadSound() {
    if (this.state.SoundModule || this.state.isLoading) {
      return this.state.SoundModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const SoundModule = await LazyLoader.importModule(
        () => import('react-native-sound'),
        'sound'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Sound = SoundModule || null;

        if (!Sound || typeof Sound !== 'function') {
          throw new Error('Sound module or constructor not found');
        }

        // Enable sound playback in silence mode (iOS)
        try {
          if (Sound.setCategory) {
            Sound.setCategory('Playback', true);
          }
        } catch (error) {
          console.warn('Failed to set sound category:', error);
        }

        this.setState({
          SoundModule: Sound,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Sound);
        }

        return Sound;
      }
    } catch (error) {
      console.warn('Failed to load Sound:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          SoundModule: null,
          isLoading: false,
          loadError: errorMessage,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(null);
        }
      }
    }

    return null;
  }

  public async createSound(filename: string, basePath?: string, onError?: (error: any) => void, options?: any): Promise<SoundInstance | null> {
    const Sound = await this.loadSound();
    if (!Sound) {
      throw new Error('Sound not available');
    }
    return new Sound(filename, basePath || '', onError, options);
  }

  public async setCategory(category: string, mixWithOthers?: boolean) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.setCategory) {
      throw new Error('Sound setCategory not available');
    }
    return Sound.setCategory(category, mixWithOthers);
  }

  public async getCategory(callback: (category: string, mixWithOthers: boolean) => void) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.getCategory) {
      throw new Error('Sound getCategory not available');
    }
    return Sound.getCategory(callback);
  }

  public async setMode(mode: string) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.setMode) {
      throw new Error('Sound setMode not available');
    }
    return Sound.setMode(mode);
  }

  public async getMode(callback: (mode: string) => void) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.getMode) {
      throw new Error('Sound getMode not available');
    }
    return Sound.getMode(callback);
  }

  public async setSpeakerphoneOn(speaker: boolean) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.setSpeakerphoneOn) {
      throw new Error('Sound setSpeakerphoneOn not available');
    }
    return Sound.setSpeakerphoneOn(speaker);
  }

  public async setActive(active: boolean) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.setActive) {
      throw new Error('Sound setActive not available');
    }
    return Sound.setActive(active);
  }

  public async isWiredHeadsetPluggedIn(callback: (pluggedIn: boolean) => void) {
    const Sound = await this.loadSound();
    if (!Sound || !Sound.isWiredHeadsetPluggedIn) {
      throw new Error('Sound isWiredHeadsetPluggedIn not available');
    }
    return Sound.isWiredHeadsetPluggedIn(callback);
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { SoundModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading sound..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`Sound unavailable: ${loadError}`} />;
    }

    // Sound module loaded successfully
    if (SoundModule) {
      return (
        <View style={styles.readyContainer}>
          <Text style={styles.readyText}>Sound ready</Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing sound..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazySound = () => {
  const [state, setState] = React.useState<{
    SoundModule: SoundModule | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    SoundModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadSound = React.useCallback(async () => {
    if (state.SoundModule || state.isLoading) {
      return state.SoundModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const SoundModule = await LazyLoader.importModule(
        () => import('react-native-sound'),
        'sound'
      );

      const Sound = SoundModule || null;

      if (!Sound || typeof Sound !== 'function') {
        throw new Error('Sound module or constructor not found');
      }

      // Enable sound playback in silence mode (iOS)
      try {
        if (Sound.setCategory) {
          Sound.setCategory('Playback', true);
        }
      } catch (error) {
        console.warn('Failed to set sound category:', error);
      }

      setState({
        SoundModule: Sound,
        isLoading: false,
        loadError: null,
      });

      return Sound;
    } catch (error) {
      console.warn('Failed to load Sound:', error);
      setState({
        SoundModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.SoundModule, state.isLoading]);

  const createSound = React.useCallback(async (filename: string, basePath?: string, onError?: (error: any) => void, options?: any): Promise<SoundInstance | null> => {
    const Sound = await loadSound();
    if (!Sound) {
      throw new Error('Sound not available');
    }
    return new Sound(filename, basePath || '', onError, options);
  }, [loadSound]);

  const setCategory = React.useCallback(async (category: string, mixWithOthers?: boolean) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.setCategory) {
      throw new Error('Sound setCategory not available');
    }
    return Sound.setCategory(category, mixWithOthers);
  }, [loadSound]);

  const getCategory = React.useCallback(async (callback: (category: string, mixWithOthers: boolean) => void) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.getCategory) {
      throw new Error('Sound getCategory not available');
    }
    return Sound.getCategory(callback);
  }, [loadSound]);

  const setMode = React.useCallback(async (mode: string) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.setMode) {
      throw new Error('Sound setMode not available');
    }
    return Sound.setMode(mode);
  }, [loadSound]);

  const getMode = React.useCallback(async (callback: (mode: string) => void) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.getMode) {
      throw new Error('Sound getMode not available');
    }
    return Sound.getMode(callback);
  }, [loadSound]);

  const setSpeakerphoneOn = React.useCallback(async (speaker: boolean) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.setSpeakerphoneOn) {
      throw new Error('Sound setSpeakerphoneOn not available');
    }
    return Sound.setSpeakerphoneOn(speaker);
  }, [loadSound]);

  const setActive = React.useCallback(async (active: boolean) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.setActive) {
      throw new Error('Sound setActive not available');
    }
    return Sound.setActive(active);
  }, [loadSound]);

  const isWiredHeadsetPluggedIn = React.useCallback(async (callback: (pluggedIn: boolean) => void) => {
    const Sound = await loadSound();
    if (!Sound || !Sound.isWiredHeadsetPluggedIn) {
      throw new Error('Sound isWiredHeadsetPluggedIn not available');
    }
    return Sound.isWiredHeadsetPluggedIn(callback);
  }, [loadSound]);

  React.useEffect(() => {
    loadSound();
  }, [loadSound]);

  return {
    SoundModule: state.SoundModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadSound,
    createSound,
    setCategory,
    getCategory,
    setMode,
    getMode,
    setSpeakerphoneOn,
    setActive,
    isWiredHeadsetPluggedIn,
  };
};

/**
 * Simple fallback Sound using basic alert notifications
 */
export const FallbackSound: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError('Sound not available, audio playback disabled');
    }
  }, [onError]);

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Audio playback not available</Text>
      <Text style={styles.fallbackSubText}>
        Sound module could not be loaded
      </Text>
    </View>
  );
};

// Create fallback implementations using basic notifications
export const FallbackSoundAPI = {
  createSound: async (filename: string, basePath?: string, onError?: (error: any) => void): Promise<null> => {
    console.warn('Sound not available - cannot create sound instance');
    if (onError) {
      onError(new Error('Sound module not available'));
    }
    return null;
  },
  
  setCategory: async (category: string, mixWithOthers?: boolean) => {
    console.warn('Sound not available - cannot set category');
  },
  
  getCategory: async (callback: (category: string, mixWithOthers: boolean) => void) => {
    console.warn('Sound not available - cannot get category');
    callback('Playback', false);
  },
  
  setMode: async (mode: string) => {
    console.warn('Sound not available - cannot set mode');
  },
  
  getMode: async (callback: (mode: string) => void) => {
    console.warn('Sound not available - cannot get mode');
    callback('Default');
  },
  
  setSpeakerphoneOn: async (speaker: boolean) => {
    console.warn('Sound not available - cannot set speakerphone');
  },
  
  setActive: async (active: boolean) => {
    console.warn('Sound not available - cannot set active');
  },
  
  isWiredHeadsetPluggedIn: async (callback: (pluggedIn: boolean) => void) => {
    console.warn('Sound not available - cannot check headset');
    callback(false);
  },
};

const styles = StyleSheet.create({
  readyContainer: {
    padding: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyText: {
    fontSize: 14,
    color: '#2e7d2e',
    fontWeight: '500',
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

export default LazySound;
