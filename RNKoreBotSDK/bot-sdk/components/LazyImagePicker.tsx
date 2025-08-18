import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded ImagePicker
export interface ImagePickerOptions {
  title?: string;
  customButtons?: Array<{ name: string; title: string }>;
  cancelButtonTitle?: string;
  takePhotoButtonTitle?: string;
  chooseFromLibraryButtonTitle?: string;
  cameraType?: 'front' | 'back';
  mediaType?: 'photo' | 'video' | 'mixed';
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  videoQuality?: 'low' | 'medium' | 'high';
  durationLimit?: number;
  rotation?: number;
  allowsEditing?: boolean;
  noData?: boolean;
  storageOptions?: {
    skipBackup?: boolean;
    path?: string;
    cameraRoll?: boolean;
    waitUntilSaved?: boolean;
  };
  permissionDenied?: {
    title?: string;
    text?: string;
    reTryTitle?: string;
    okTitle?: string;
  };
  tintColor?: string;
  cancelButtonTintColor?: string;
  includeBase64?: boolean;
  includeExtra?: boolean;
  selectionLimit?: number;
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
}

export interface ImagePickerResponse {
  customButton?: string;
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Array<{
    fileName?: string;
    fileSize?: number;
    height?: number;
    width?: number;
    type?: string;
    uri?: string;
    base64?: string;
    timestamp?: string;
    duration?: number;
    bitrate?: number;
    originalPath?: string;
  }>;
}

export interface ImagePickerModule {
  launchCamera: (options: ImagePickerOptions, callback?: (response: ImagePickerResponse) => void) => Promise<ImagePickerResponse>;
  launchImageLibrary: (options: ImagePickerOptions, callback?: (response: ImagePickerResponse) => void) => Promise<ImagePickerResponse>;
  showImagePicker: (options: ImagePickerOptions, callback: (response: ImagePickerResponse) => void) => void;
  requestCameraPermission?: () => Promise<boolean>;
  requestMediaLibraryPermission?: () => Promise<boolean>;
}

interface LazyImagePickerState {
  ImagePickerModule: ImagePickerModule | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyImagePickerProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (imagePickerModule: ImagePickerModule | null) => void;
}

/**
 * Lazy-loaded ImagePicker component that dynamically imports 
 * react-native-image-picker only when needed
 */
export class LazyImagePicker extends Component<LazyImagePickerProps, LazyImagePickerState> {
  private mounted = true;

  constructor(props: LazyImagePickerProps) {
    super(props);
    this.state = {
      ImagePickerModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadImagePicker();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadImagePicker() {
    if (this.state.ImagePickerModule || this.state.isLoading) {
      return this.state.ImagePickerModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const ImagePickerModule = await LazyLoader.importModule(
        () => import('react-native-image-picker'),
        'imagepicker'
      );

      if (this.mounted) {
        // Handle different export patterns
        const ImagePicker = ImagePickerModule || null;

        if (!ImagePicker || !ImagePicker.launchCamera) {
          throw new Error('ImagePicker module or required methods not found');
        }

        this.setState({
          ImagePickerModule: ImagePicker,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(ImagePicker);
        }

        return ImagePicker;
      }
    } catch (error) {
      console.warn('Failed to load ImagePicker:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          ImagePickerModule: null,
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

  public async launchCamera(options: ImagePickerOptions, callback?: (response: ImagePickerResponse) => void) {
    const imagePicker = await this.loadImagePicker();
    if (!imagePicker) {
      const errorResponse: ImagePickerResponse = {
        errorMessage: 'Image picker not available',
        errorCode: 'module_not_available'
      };
      if (callback) callback(errorResponse);
      return errorResponse;
    }
    
    if (callback) {
      return imagePicker.launchCamera(options, callback);
    }
    return imagePicker.launchCamera(options);
  }

  public async launchImageLibrary(options: ImagePickerOptions, callback?: (response: ImagePickerResponse) => void) {
    const imagePicker = await this.loadImagePicker();
    if (!imagePicker) {
      const errorResponse: ImagePickerResponse = {
        errorMessage: 'Image picker not available',
        errorCode: 'module_not_available'
      };
      if (callback) callback(errorResponse);
      return errorResponse;
    }
    
    if (callback) {
      return imagePicker.launchImageLibrary(options, callback);
    }
    return imagePicker.launchImageLibrary(options);
  }

  public async showImagePicker(options: ImagePickerOptions, callback: (response: ImagePickerResponse) => void) {
    const imagePicker = await this.loadImagePicker();
    if (!imagePicker) {
      const errorResponse: ImagePickerResponse = {
        errorMessage: 'Image picker not available',
        errorCode: 'module_not_available'
      };
      callback(errorResponse);
      return;
    }
    
    if (imagePicker.showImagePicker) {
      imagePicker.showImagePicker(options, callback);
    } else {
      // Fallback to launchImageLibrary if showImagePicker is not available
      this.launchImageLibrary(options, callback);
    }
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { ImagePickerModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading image picker..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`Image picker unavailable: ${loadError}`} />;
    }

    // ImagePicker module loaded successfully
    if (ImagePickerModule) {
      return (
        <View style={styles.readyContainer}>
          <Text style={styles.readyText}>Image picker ready</Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing image picker..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyImagePicker = () => {
  const [state, setState] = React.useState<{
    ImagePickerModule: ImagePickerModule | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    ImagePickerModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadImagePicker = React.useCallback(async () => {
    if (state.ImagePickerModule || state.isLoading) {
      return state.ImagePickerModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const ImagePickerModule = await LazyLoader.importModule(
        () => import('react-native-image-picker'),
        'imagepicker'
      );

      const ImagePicker = ImagePickerModule || null;

      if (!ImagePicker || !ImagePicker.launchCamera) {
        throw new Error('ImagePicker module or required methods not found');
      }

      setState({
        ImagePickerModule: ImagePicker,
        isLoading: false,
        loadError: null,
      });

      return ImagePicker;
    } catch (error) {
      console.warn('Failed to load ImagePicker:', error);
      setState({
        ImagePickerModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.ImagePickerModule, state.isLoading]);

  const launchCamera = React.useCallback(async (
    options: ImagePickerOptions, 
    callback?: (response: ImagePickerResponse) => void
  ) => {
    const imagePicker = await loadImagePicker();
    if (!imagePicker) {
      const errorResponse: ImagePickerResponse = {
        errorMessage: 'Image picker not available',
        errorCode: 'module_not_available'
      };
      if (callback) callback(errorResponse);
      return errorResponse;
    }
    
    if (callback) {
      return imagePicker.launchCamera(options, callback);
    }
    return imagePicker.launchCamera(options);
  }, [loadImagePicker]);

  const launchImageLibrary = React.useCallback(async (
    options: ImagePickerOptions, 
    callback?: (response: ImagePickerResponse) => void
  ) => {
    const imagePicker = await loadImagePicker();
    if (!imagePicker) {
      const errorResponse: ImagePickerResponse = {
        errorMessage: 'Image picker not available',
        errorCode: 'module_not_available'
      };
      if (callback) callback(errorResponse);
      return errorResponse;
    }
    
    if (callback) {
      return imagePicker.launchImageLibrary(options, callback);
    }
    return imagePicker.launchImageLibrary(options);
  }, [loadImagePicker]);

  React.useEffect(() => {
    loadImagePicker();
  }, [loadImagePicker]);

  return {
    ImagePickerModule: state.ImagePickerModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadImagePicker,
    launchCamera,
    launchImageLibrary,
  };
};

/**
 * Simple fallback ImagePicker component
 * This can be used when image picker is not available
 */
export const FallbackImagePicker: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError('Image picker not available on this device');
    }
  }, [onError]);

  const handlePress = () => {
    Alert.alert(
      'Image Picker Unavailable',
      'Image selection is not available on this device or platform.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Image picker not supported</Text>
      <Text style={styles.fallbackSubText}>
        This feature requires device support for image selection
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

export default LazyImagePicker;
