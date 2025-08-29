import React, { Component, ComponentType } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Video
export interface VideoProps {
  source: { uri: string } | number;
  style?: any;
  paused?: boolean;
  muted?: boolean;
  volume?: number;
  rate?: number;
  repeat?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  onLoad?: (data: any) => void;
  onProgress?: (data: any) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onBuffer?: (data: any) => void;
  onSeek?: (data: any) => void;
  onReadyForDisplay?: () => void;
  poster?: string;
  posterResizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  playInBackground?: boolean;
  playWhenInactive?: boolean;
  ignoreSilentSwitch?: 'inherit' | 'ignore' | 'obey';
  reportBandwidth?: boolean;
  controls?: boolean;
  currentTime?: number;
  progressUpdateInterval?: number;
  useTextureView?: boolean;
  hideShutterView?: boolean;
  bufferConfig?: {
    minBufferMs?: number;
    maxBufferMs?: number;
    bufferForPlaybackMs?: number;
    bufferForPlaybackAfterRebufferMs?: number;
  };
  selectedVideoTrack?: {
    type: 'auto' | 'disabled' | 'resolution' | 'index';
    value?: any;
  };
  selectedAudioTrack?: {
    type: 'system' | 'disabled' | 'title' | 'language' | 'index';
    value?: any;
  };
  selectedTextTrack?: {
    type: 'system' | 'disabled' | 'title' | 'language' | 'index';
    value?: any;
  };
  textTracks?: Array<{
    title: string;
    language: string;
    type: string;
    uri: string;
  }>;
  onTimedMetadata?: (data: any) => void;
  onVideoLoad?: (data: any) => void;
  onVideoError?: (error: any) => void;
  onVideoProgress?: (data: any) => void;
  onVideoSeek?: (data: any) => void;
  onVideoEnd?: () => void;
  onVideoBandwidthUpdate?: (data: any) => void;
  onVideoBuffer?: (data: any) => void;
  onVideoExternalPlaybackChange?: (data: any) => void;
  onVideoFullscreenPlayerWillPresent?: () => void;
  onVideoFullscreenPlayerDidPresent?: () => void;
  onVideoFullscreenPlayerWillDismiss?: () => void;
  onVideoFullscreenPlayerDidDismiss?: () => void;
}

interface LazyVideoState {
  VideoComponent: ComponentType<VideoProps> | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyVideoProps extends VideoProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (videoModule: ComponentType<VideoProps> | null) => void;
}

/**
 * Lazy-loaded Video component that dynamically imports 
 * react-native-video only when needed
 */
export class LazyVideo extends Component<LazyVideoProps, LazyVideoState> {
  private mounted = true;

  constructor(props: LazyVideoProps) {
    super(props);
    this.state = {
      VideoComponent: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadVideo();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadVideo() {
    if (this.state.VideoComponent || this.state.isLoading) {
      return this.state.VideoComponent;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const VideoModule = await LazyLoader.importModule(
        () => import('react-native-video'),
        'video'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Video = VideoModule?.default || VideoModule || null;

        if (!Video) {
          throw new Error('Video component not found in module');
        }

        this.setState({
          VideoComponent: Video,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Video);
        }

        return Video;
      }
    } catch (error) {
      console.warn('Failed to load Video:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          VideoComponent: null,
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
      ...videoProps 
    } = this.props;
    
    const { VideoComponent, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading video player..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...videoProps} />;
      }
      return <ErrorFallback error={`Video player unavailable: ${loadError}`} />;
    }

    // Show the actual Video component
    if (VideoComponent) {
      return <VideoComponent {...videoProps} />;
    }

    // Default loading state
    return <DefaultLoader text="Initializing video player..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyVideo = () => {
  const [state, setState] = React.useState<{
    VideoComponent: ComponentType<VideoProps> | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    VideoComponent: null,
    isLoading: false,
    loadError: null,
  });

  const loadVideo = React.useCallback(async () => {
    if (state.VideoComponent || state.isLoading) {
      return state.VideoComponent;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const VideoModule = await LazyLoader.importModule(
        () => import('react-native-video'),
        'video'
      );

      const Video = VideoModule?.default || VideoModule || null;

      if (!Video) {
        throw new Error('Video component not found in module');
      }

      setState({
        VideoComponent: Video,
        isLoading: false,
        loadError: null,
      });

      return Video;
    } catch (error) {
      console.warn('Failed to load Video:', error);
      setState({
        VideoComponent: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.VideoComponent, state.isLoading]);

  React.useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  return {
    VideoComponent: state.VideoComponent,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadVideo,
  };
};

/**
 * Simple fallback Video component
 * This can be used when the video player fails to load
 */
export const FallbackVideo: React.FC<VideoProps> = ({ 
  source, 
  style, 
  poster,
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError({ error: 'Video player not available' });
    }
  }, [onError]);

  const handlePress = () => {
    if (typeof source === 'object' && source.uri) {
      // Could potentially open in external player or browser
      console.log('Would open video:', source.uri);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.fallbackContainer, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {poster ? (
        <View style={styles.fallbackPosterContainer}>
          <Text style={styles.fallbackText}>Video Player Unavailable</Text>
          <Text style={styles.fallbackSubText}>Tap to try external player</Text>
        </View>
      ) : (
        <View style={styles.fallbackContent}>
          <View style={styles.fallbackIcon}>
            <Text style={styles.fallbackIconText}>▶</Text>
          </View>
          <Text style={styles.fallbackText}>Video Player Not Available</Text>
          <Text style={styles.fallbackSubText}>
            Video playback requires the video player module
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    borderRadius: 8,
  },
  fallbackContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackPosterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
  },
  fallbackIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  fallbackIconText: {
    fontSize: 24,
    color: 'white',
    marginLeft: 4, // Adjust for play button visual balance
  },
  fallbackText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LazyVideo;
