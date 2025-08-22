import React, { Component, ComponentType } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded FastImage
export interface FastImageProps {
  source: { uri: string } | number | { uri: string; headers?: object; priority?: string; cache?: string };
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  onLoad?: (event: any) => void;
  onError?: (error: any) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onProgress?: (event: any) => void;
  fallback?: boolean;
  defaultSource?: { uri: string } | number;
  children?: React.ReactNode;
  testID?: string;
}

export interface FastImageModule extends ComponentType<FastImageProps> {
  priority: {
    low: string;
    normal: string;
    high: string;
  };
  cacheControl: {
    immutable: string;
    web: string;
    cacheOnly: string;
  };
  resizeMode: {
    contain: string;
    cover: string;
    stretch: string;
    center: string;
  };
  preload: (sources: Array<{ uri: string; headers?: object }>) => void;
  clearMemoryCache: () => Promise<void>;
  clearDiskCache: () => Promise<void>;
}

interface LazyFastImageState {
  FastImageModule: FastImageModule | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyFastImageProps extends FastImageProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (fastImageModule: FastImageModule | null) => void;
}

/**
 * Lazy-loaded FastImage component that dynamically imports 
 * react-native-fast-image only when needed
 */
export class LazyFastImage extends Component<LazyFastImageProps, LazyFastImageState> {
  private mounted = true;

  constructor(props: LazyFastImageProps) {
    super(props);
    this.state = {
      FastImageModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadFastImage();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadFastImage() {
    if (this.state.FastImageModule || this.state.isLoading) {
      return this.state.FastImageModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const FastImageModule = await LazyLoader.importModule(
        () => import('react-native-fast-image'),
        'fastimage'
      );

      if (this.mounted) {
        // Handle different export patterns
        const FastImage = FastImageModule?.default || FastImageModule || null;

        if (!FastImage) {
          throw new Error('FastImage component not found in module');
        }

        this.setState({
          FastImageModule: FastImage,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(FastImage);
        }

        return FastImage;
      }
    } catch (error) {
      console.warn('Failed to load FastImage:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          FastImageModule: null,
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

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
      onModuleLoaded,
      ...fastImageProps 
    } = this.props;
    
    const { FastImageModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading image..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...fastImageProps} />;
      }
      return <ErrorFallback error={`FastImage unavailable: ${loadError}`} />;
    }

    // Show the actual FastImage component
    if (FastImageModule) {
      return <FastImageModule {...fastImageProps} />;
    }

    // Default loading state
    return <DefaultLoader text="Initializing image..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyFastImage = () => {
  const [state, setState] = React.useState<{
    FastImageModule: FastImageModule | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    FastImageModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadFastImage = React.useCallback(async () => {
    if (state.FastImageModule || state.isLoading) {
      return state.FastImageModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const FastImageModule = await LazyLoader.importModule(
        () => import('react-native-fast-image'),
        'fastimage'
      );

      const FastImage = FastImageModule?.default || FastImageModule || null;

      if (!FastImage) {
        throw new Error('FastImage component not found in module');
      }

      setState({
        FastImageModule: FastImage,
        isLoading: false,
        loadError: null,
      });

      return FastImage;
    } catch (error) {
      console.warn('Failed to load FastImage:', error);
      setState({
        FastImageModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.FastImageModule, state.isLoading]);

  const preload = React.useCallback(async (sources: Array<{ uri: string; headers?: object }>) => {
    const fastImage = await loadFastImage();
    if (fastImage && fastImage.preload) {
      return fastImage.preload(sources);
    }
  }, [loadFastImage]);

  const clearMemoryCache = React.useCallback(async () => {
    const fastImage = await loadFastImage();
    if (fastImage && fastImage.clearMemoryCache) {
      return fastImage.clearMemoryCache();
    }
  }, [loadFastImage]);

  const clearDiskCache = React.useCallback(async () => {
    const fastImage = await loadFastImage();
    if (fastImage && fastImage.clearDiskCache) {
      return fastImage.clearDiskCache();
    }
  }, [loadFastImage]);

  React.useEffect(() => {
    loadFastImage();
  }, [loadFastImage]);

  return {
    FastImageModule: state.FastImageModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadFastImage,
    preload,
    clearMemoryCache,
    clearDiskCache,
  };
};

/**
 * Simple fallback FastImage using standard React Native Image
 */
export const FallbackFastImage: React.FC<FastImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  defaultSource,
  children,
  ...props
}) => {
  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onLoad={onLoad}
      onError={onError}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      defaultSource={defaultSource}
      {...props}
    >
      {children}
    </Image>
  );
};

// Attach static properties for API compatibility
(FallbackFastImage as any).priority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
};

(FallbackFastImage as any).cacheControl = {
  immutable: 'immutable',
  web: 'web',
  cacheOnly: 'cacheOnly',
};

(FallbackFastImage as any).resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center',
};

(FallbackFastImage as any).preload = () => {
  console.warn('FastImage preload not available in fallback mode');
};

(FallbackFastImage as any).clearMemoryCache = () => {
  console.warn('FastImage clearMemoryCache not available in fallback mode');
  return Promise.resolve();
};

(FallbackFastImage as any).clearDiskCache = () => {
  console.warn('FastImage clearDiskCache not available in fallback mode');
  return Promise.resolve();
};

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  fallbackRect: {
    borderRadius: 2,
  },
  fallbackCircle: {
    // Styles handled dynamically in component
  },
  fallbackSvgText: {
    fontSize: 14,
    color: '#333',
  },
  fallbackImage: {
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
});

export default LazyFastImage;
