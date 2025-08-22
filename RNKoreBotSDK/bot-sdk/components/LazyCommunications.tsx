import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Communications
export interface CommunicationsModule {
  phonecall: (phoneNumber: string, prompt?: boolean) => void;
  email: (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => void;
  text: (phoneNumber?: string, body?: string) => void;
  web: (url: string) => void;
}

interface LazyCommunicationsState {
  CommunicationsModule: CommunicationsModule | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyCommunicationsProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (communicationsModule: CommunicationsModule | null) => void;
}

/**
 * Lazy-loaded Communications component that dynamically imports 
 * react-native-communications only when needed
 */
export class LazyCommunications extends Component<LazyCommunicationsProps, LazyCommunicationsState> {
  private mounted = true;

  constructor(props: LazyCommunicationsProps) {
    super(props);
    this.state = {
      CommunicationsModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadCommunications();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadCommunications() {
    if (this.state.CommunicationsModule || this.state.isLoading) {
      return this.state.CommunicationsModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const CommunicationsModule = await LazyLoader.importModule(
        () => import('react-native-communications'),
        'communications'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Communications = CommunicationsModule || null;

        if (!Communications || !Communications.phonecall) {
          throw new Error('Communications module or required methods not found');
        }

        this.setState({
          CommunicationsModule: Communications,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Communications);
        }

        return Communications;
      }
    } catch (error) {
      console.warn('Failed to load Communications:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          CommunicationsModule: null,
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

  public async phonecall(phoneNumber: string, prompt: boolean = false) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.phonecall(phoneNumber, prompt);
  }

  public async email(to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.email(to, cc, bcc, subject, body);
  }

  public async text(phoneNumber?: string, body?: string) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.text(phoneNumber, body);
  }

  public async web(url: string) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.web(url);
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    
    const { CommunicationsModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading communications..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <ErrorFallback error={`Communications unavailable: ${loadError}`} />;
    }

    // Communications module loaded successfully
    if (CommunicationsModule) {
      return (
        <View style={styles.readyContainer}>
          <Text style={styles.readyText}>Communications ready</Text>
        </View>
      );
    }

    // Default loading state
    return <DefaultLoader text="Initializing communications..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyCommunications = () => {
  const [state, setState] = React.useState<{
    CommunicationsModule: CommunicationsModule | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    CommunicationsModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadCommunications = React.useCallback(async () => {
    if (state.CommunicationsModule || state.isLoading) {
      return state.CommunicationsModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const CommunicationsModule = await LazyLoader.importModule(
        () => import('react-native-communications'),
        'communications'
      );

      const Communications = CommunicationsModule || null;

      if (!Communications || !Communications.phonecall) {
        throw new Error('Communications module or required methods not found');
      }

      setState({
        CommunicationsModule: Communications,
        isLoading: false,
        loadError: null,
      });

      return Communications;
    } catch (error) {
      console.warn('Failed to load Communications:', error);
      setState({
        CommunicationsModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.CommunicationsModule, state.isLoading]);

  const phonecall = React.useCallback(async (phoneNumber: string, prompt: boolean = false) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.phonecall(phoneNumber, prompt);
  }, [loadCommunications]);

  const email = React.useCallback(async (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.email(to, cc, bcc, subject, body);
  }, [loadCommunications]);

  const text = React.useCallback(async (phoneNumber?: string, body?: string) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.text(phoneNumber, body);
  }, [loadCommunications]);

  const web = React.useCallback(async (url: string) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error('Communications not available');
    }
    return communications.web(url);
  }, [loadCommunications]);

  React.useEffect(() => {
    loadCommunications();
  }, [loadCommunications]);

  return {
    CommunicationsModule: state.CommunicationsModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadCommunications,
    phonecall,
    email,
    text,
    web,
  };
};

/**
 * Simple fallback Communications using React Native Linking
 */
export const FallbackCommunications: React.FC<{ onError?: (message: string) => void }> = ({ 
  onError 
}) => {
  React.useEffect(() => {
    if (onError) {
      onError('Communications not available, using basic Linking fallback');
    }
  }, [onError]);

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Communications not available</Text>
      <Text style={styles.fallbackSubText}>
        Using basic device linking capabilities
      </Text>
    </View>
  );
};

// Create fallback implementations using Linking API
export const FallbackCommunicationsAPI: CommunicationsModule = {
  phonecall: (phoneNumber: string, prompt: boolean = false) => {
    const url = `tel:${phoneNumber}`;
    if (prompt) {
      Alert.alert(
        'Make Phone Call',
        `Call ${phoneNumber}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Linking.openURL(url) },
        ]
      );
    } else {
      Linking.openURL(url).catch(err => console.error('Failed to make phone call:', err));
    }
  },
  
  email: (to?: string[], cc?: string[], bcc?: string[], subject?: string, body?: string) => {
    let url = 'mailto:';
    if (to && to.length > 0) {
      url += to.join(',');
    }
    
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (cc && cc.length > 0) params.push(`cc=${cc.join(',')}`);
    if (bcc && bcc.length > 0) params.push(`bcc=${bcc.join(',')}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    Linking.openURL(url).catch(err => console.error('Failed to open email:', err));
  },
  
  text: (phoneNumber?: string, body?: string) => {
    let url = 'sms:';
    if (phoneNumber) {
      url += phoneNumber;
    }
    if (body) {
      url += Platform.OS === 'ios' ? `&body=${encodeURIComponent(body)}` : `?body=${encodeURIComponent(body)}`;
    }
    
    Linking.openURL(url).catch(err => console.error('Failed to open SMS:', err));
  },
  
  web: (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
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

export default LazyCommunications;
