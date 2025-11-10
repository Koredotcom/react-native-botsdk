import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded DocumentPicker
export interface DocumentPickerOptions {
  type?: string[] | string;
  mode?: 'import' | 'open';
  copyTo?: 'cachesDirectory' | 'documentDirectory';
  allowMultiSelection?: boolean;
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  transitionStyle?: 'coverVertical' | 'flipHorizontal' | 'crossDissolve' | 'partialCurl';
}

export interface DocumentPickerResponse {
  uri: string;
  name?: string;
  copyError?: string;
  fileCopyUri?: string | null;
  type?: string;
  size?: number;
}

export interface DocumentPickerModule {
  pick: (options?: DocumentPickerOptions) => Promise<DocumentPickerResponse[]>;
  pickSingle: (options?: DocumentPickerOptions) => Promise<DocumentPickerResponse>;
  pickMultiple: (options?: DocumentPickerOptions) => Promise<DocumentPickerResponse[]>;
  releaseSecureAccess: (uris: string[]) => Promise<void>;
  isCancel: (err: any) => boolean;
  types: {
    allFiles: string;
    images: string;
    plainText: string;
    audio: string;
    pdf: string;
    zip: string;
    csv: string;
    doc: string;
    docx: string;
    ppt: string;
    pptx: string;
    xls: string;
    xlsx: string;
    [key: string]: string;
  };
}

interface LazyDocumentPickerState {
  DocumentPickerModule: DocumentPickerModule | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyDocumentPickerProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (documentPickerModule: DocumentPickerModule | null) => void;
}

/**
 * Lazy-loaded DocumentPicker component that dynamically imports 
 * @react-native-documents/picker only when needed
 */
export class LazyDocumentPicker extends Component<LazyDocumentPickerProps, LazyDocumentPickerState> {
  private mounted = true;

  constructor(props: LazyDocumentPickerProps) {
    super(props);
    this.state = {
      DocumentPickerModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadDocumentPicker();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadDocumentPicker() {
    if (this.state.DocumentPickerModule || this.state.isLoading) {
      return this.state.DocumentPickerModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const DocumentPickerModule = await LazyLoader.importModule(
        () => import('@react-native-documents/picker'),
        'documentpicker'
      );

      if (this.mounted) {
        // Handle different export patterns - @react-native-documents/picker uses named exports
        const DocumentPicker = DocumentPickerModule || null;

        if (!DocumentPicker || !DocumentPicker.pick) {
          throw new Error('DocumentPicker module or required methods not found');
        }

        this.setState({
          DocumentPickerModule: DocumentPicker,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(DocumentPicker);
        }

        return DocumentPicker;
      }
    } catch (error) {
      console.warn('Failed to load DocumentPicker:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          DocumentPickerModule: null,
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

  public async pick(options?: DocumentPickerOptions) {
    const documentPicker = await this.loadDocumentPicker();
    if (!documentPicker) {
      throw new Error('Document picker not available');
    }
    return documentPicker.pick(options);
  }

  public async pickSingle(options?: DocumentPickerOptions) {
    const documentPicker = await this.loadDocumentPicker();
    if (!documentPicker) {
      throw new Error('Document picker not available');
    }
    return documentPicker.pickSingle(options);
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { DocumentPickerModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading document picker..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`Document picker unavailable: ${loadError}`} />;
    }

    // DocumentPicker module loaded successfully
    if (DocumentPickerModule) {
      return (
        <View style={styles.readyContainer}>
          <Text style={styles.readyText}>Document picker ready</Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing document picker..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyDocumentPicker = () => {
  const [state, setState] = React.useState<{
    DocumentPickerModule: DocumentPickerModule | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    DocumentPickerModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadDocumentPicker = React.useCallback(async () => {
    if (state.DocumentPickerModule || state.isLoading) {
      return state.DocumentPickerModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const DocumentPickerModule = await LazyLoader.importModule(
        () => import('@react-native-documents/picker'),
        'documentpicker'
      );

      const DocumentPicker = DocumentPickerModule || null;

      if (!DocumentPicker || !DocumentPicker.pick) {
        throw new Error('DocumentPicker module or required methods not found');
      }

      setState({
        DocumentPickerModule: DocumentPicker,
        isLoading: false,
        loadError: null,
      });

      return DocumentPicker;
    } catch (error) {
      console.warn('Failed to load DocumentPicker:', error);
      setState({
        DocumentPickerModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.DocumentPickerModule, state.isLoading]);

  const pick = React.useCallback(async (options?: DocumentPickerOptions) => {
    const documentPicker = await loadDocumentPicker();
    if (!documentPicker) {
      throw new Error('Document picker not available');
    }
    return documentPicker.pick(options);
  }, [loadDocumentPicker]);

  React.useEffect(() => {
    loadDocumentPicker();
  }, [loadDocumentPicker]);

  return {
    DocumentPickerModule: state.DocumentPickerModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadDocumentPicker,
    pick,
  };
};

/**
 * Simple fallback DocumentPicker component
 * This can be used when document picker is not available
 */
export const FallbackDocumentPicker: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError('Document picker not available on this device');
    }
  }, [onError]);

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Document picker not supported</Text>
      <Text style={styles.fallbackSubText}>
        This feature requires device support for document selection
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

export default LazyDocumentPicker;
