import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Orientation
export interface OrientationModule {
  lockToPortrait: () => void;
  lockToLandscape: () => void;
  lockToLandscapeLeft: () => void;
  lockToLandscapeRight: () => void;
  unlockAllOrientations: () => void;
  getOrientation: (callback: (orientation: string) => void) => void;
  getDeviceOrientation: (callback: (orientation: string) => void) => void;
  addOrientationListener: (callback: (orientation: string) => void) => void;
  removeOrientationListener: (callback: (orientation: string) => void) => void;
  getInitialOrientation: () => string;
}

interface LazyOrientationState {
  OrientationModule: OrientationModule | null;
  isLoading: boolean;
  loadError: string | null;
  currentOrientation: string;
}

export interface LazyOrientationProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (orientationModule: OrientationModule | null) => void;
  onOrientationChange?: (orientation: string) => void;
}

/**
 * Lazy-loaded Orientation component that dynamically imports 
 * react-native-orientation-locker only when needed
 */
export class LazyOrientation extends Component<LazyOrientationProps, LazyOrientationState> {
  private mounted = true;
  private orientationListener: ((orientation: string) => void) | null = null;

  constructor(props: LazyOrientationProps) {
    super(props);
    
    // Get initial orientation from dimensions
    const { width, height } = Dimensions.get('window');
    const initialOrientation = width > height ? 'landscape' : 'portrait';
    
    this.state = {
      OrientationModule: null,
      isLoading: false,
      loadError: null,
      currentOrientation: initialOrientation,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadOrientation();
    }
    
    // Set up dimension change listener as fallback
    this.setupDimensionListener();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cleanupListeners();
  }

  private setupDimensionListener() {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const orientation = window.width > window.height ? 'landscape' : 'portrait';
      if (orientation !== this.state.currentOrientation) {
        this.setState({ currentOrientation: orientation });
        if (this.props.onOrientationChange) {
          this.props.onOrientationChange(orientation);
        }
      }
    });

    // Store for cleanup
    (this as any).dimensionSubscription = subscription;
  }

  private cleanupListeners() {
    if ((this as any).dimensionSubscription) {
      (this as any).dimensionSubscription.remove();
    }
    
    if (this.state.OrientationModule && this.orientationListener) {
      this.state.OrientationModule.removeOrientationListener(this.orientationListener);
    }
  }

  public async loadOrientation() {
    if (this.state.OrientationModule || this.state.isLoading) {
      return this.state.OrientationModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const OrientationModule = await LazyLoader.importModule(
        () => import('react-native-orientation-locker'),
        'orientation'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Orientation = OrientationModule?.default || OrientationModule || null;

        if (!Orientation || !Orientation.lockToPortrait) {
          throw new Error('Orientation module or required methods not found');
        }

        // Set up orientation listener
        if (this.props.onOrientationChange) {
          this.orientationListener = this.props.onOrientationChange;
          Orientation.addOrientationListener(this.orientationListener);
        }

        this.setState({
          OrientationModule: Orientation,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Orientation);
        }

        return Orientation;
      }
    } catch (error) {
      console.warn('Failed to load Orientation:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          OrientationModule: null,
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

  public async lockToPortrait() {
    const orientation = await this.loadOrientation();
    if (!orientation) {
      console.warn('Orientation locker not available, cannot lock to portrait');
      return;
    }
    return orientation.lockToPortrait();
  }

  public async lockToLandscape() {
    const orientation = await this.loadOrientation();
    if (!orientation) {
      console.warn('Orientation locker not available, cannot lock to landscape');
      return;
    }
    return orientation.lockToLandscape();
  }

  public async unlockAllOrientations() {
    const orientation = await this.loadOrientation();
    if (!orientation) {
      console.warn('Orientation locker not available, cannot unlock orientations');
      return;
    }
    return orientation.unlockAllOrientations();
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { OrientationModule, isLoading, loadError, currentOrientation } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading orientation control..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`Orientation control unavailable: ${loadError}`} />;
    }

    // Orientation module loaded successfully
    if (OrientationModule) {
      return (
        <View style={styles.readyContainer}>
          <Text style={styles.readyText}>
            Orientation control ready ({currentOrientation})
          </Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing orientation control..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyOrientation = (onOrientationChange?: (orientation: string) => void) => {
  const [state, setState] = React.useState<{
    OrientationModule: OrientationModule | null;
    isLoading: boolean;
    loadError: string | null;
    currentOrientation: string;
  }>({
    OrientationModule: null,
    isLoading: false,
    loadError: null,
    currentOrientation: 'portrait',
  });

  const loadOrientation = React.useCallback(async () => {
    if (state.OrientationModule || state.isLoading) {
      return state.OrientationModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const OrientationModule = await LazyLoader.importModule(
        () => import('react-native-orientation-locker'),
        'orientation'
      );

      const Orientation = OrientationModule?.default || OrientationModule || null;

      if (!Orientation || !Orientation.lockToPortrait) {
        throw new Error('Orientation module or required methods not found');
      }

      // Set up orientation listener
      if (onOrientationChange) {
        Orientation.addOrientationListener(onOrientationChange);
      }

      setState(prev => ({
        ...prev,
        OrientationModule: Orientation,
        isLoading: false,
        loadError: null,
      }));

      return Orientation;
    } catch (error) {
      console.warn('Failed to load Orientation:', error);
      setState(prev => ({
        ...prev,
        OrientationModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      }));
      return null;
    }
  }, [state.OrientationModule, state.isLoading, onOrientationChange]);

  const lockToPortrait = React.useCallback(async () => {
    const orientation = await loadOrientation();
    if (!orientation) {
      console.warn('Orientation locker not available');
      return;
    }
    return orientation.lockToPortrait();
  }, [loadOrientation]);

  const lockToLandscape = React.useCallback(async () => {
    const orientation = await loadOrientation();
    if (!orientation) {
      console.warn('Orientation locker not available');
      return;
    }
    return orientation.lockToLandscape();
  }, [loadOrientation]);

  const unlockAllOrientations = React.useCallback(async () => {
    const orientation = await loadOrientation();
    if (!orientation) {
      console.warn('Orientation locker not available');
      return;
    }
    return orientation.unlockAllOrientations();
  }, [loadOrientation]);

  // Set up dimension listener for fallback orientation detection
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const orientation = window.width > window.height ? 'landscape' : 'portrait';
      setState(prev => ({ ...prev, currentOrientation: orientation }));
    });

    return () => subscription?.remove();
  }, []);

  React.useEffect(() => {
    loadOrientation();
  }, [loadOrientation]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (state.OrientationModule && onOrientationChange) {
        state.OrientationModule.removeOrientationListener(onOrientationChange);
      }
    };
  }, [state.OrientationModule, onOrientationChange]);

  return {
    OrientationModule: state.OrientationModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    currentOrientation: state.currentOrientation,
    loadOrientation,
    lockToPortrait,
    lockToLandscape,
    unlockAllOrientations,
  };
};

/**
 * Simple fallback Orientation using dimension detection
 */
export const FallbackOrientation: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  const [orientation, setOrientation] = React.useState('portrait');

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newOrientation = window.width > window.height ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    });

    if (onError) {
      onError('Orientation locker not available, using basic detection');
    }

    return () => subscription?.remove();
  }, [onError]);

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Orientation control not available</Text>
      <Text style={styles.fallbackSubText}>
        Current: {orientation} (detection only)
      </Text>
    </View>
  );
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

export default LazyOrientation;
