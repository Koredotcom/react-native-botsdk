import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded ParsedText - using flexible types to match react-native-parsed-text
export interface ParsedTextModule {
  default: React.ComponentType<ParsedTextProps>;
}

export interface ParsedTextProps {
  style?: any;
  parse?: any[];
  childrenProps?: any;
  children?: React.ReactNode;
  onPress?: (url: string, matchIndex: number) => void;
  onLongPress?: (url: string, matchIndex: number) => void;
  [key: string]: any; // Allow any additional props
}

interface LazyParsedTextState {
  ParsedTextComponent: React.ComponentType<ParsedTextProps> | null;
  isLoading: boolean;
  loadError: string | null;
  hasAttemptedLoad: boolean;
}

export interface LazyParsedTextProps extends ParsedTextProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (parsedTextComponent: React.ComponentType<ParsedTextProps> | null) => void;
  hideUI?: boolean; // When true, component renders children as regular Text if module fails to load
}

/**
 * Lazy-loaded ParsedText component that dynamically imports 
 * react-native-parsed-text only when needed
 */
export class LazyParsedText extends Component<LazyParsedTextProps, LazyParsedTextState> {
  private mounted = true;

  constructor(props: LazyParsedTextProps) {
    super(props);
    this.state = {
      ParsedTextComponent: null,
      isLoading: false,
      loadError: null,
      hasAttemptedLoad: false,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      // Add a small delay to prevent immediate loading issues
      setTimeout(() => {
        this.loadParsedText();
      }, 10);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadParsedText() {
    if (this.state.ParsedTextComponent || this.state.isLoading || this.state.hasAttemptedLoad) {
      return this.state.ParsedTextComponent;
    }

    this.setState({ isLoading: true, loadError: null, hasAttemptedLoad: true });

    try {
      // Dynamic import with fallback for different module structures
      const ParsedTextModule = await LazyLoader.importModule(
        () => import('react-native-parsed-text'),
        'parsedtext'
      );

      if (this.mounted) {
        // ParsedText module is already the default export from LazyLoader
        const ParsedTextComponent = ParsedTextModule;

        if (!ParsedTextComponent) {
          throw new Error('ParsedText module not found');
        }

        this.setState({
          ParsedTextComponent,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(ParsedTextComponent);
        }

        return ParsedTextComponent;
      }
    } catch (error) {
      console.warn('Failed to load ParsedText:', error);
      
      if (this.mounted) {
        let errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        this.setState({
          ParsedTextComponent: null,
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
      hideUI = false,
      children,
      style,
      autoLoad,
      onModuleLoaded,
      ...parsedTextProps
    } = this.props;
    
    const { ParsedTextComponent, isLoading, loadError } = this.state;

    // If hideUI is true, render nothing visually but still load the module
    if (hideUI) {
      return null;
    }

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      // Don't show loading for ParsedText since it should be seamless
      return (
        <Text style={style} {...parsedTextProps}>
          {children}
        </Text>
      );
    }

    // Show error state or fallback to regular Text
    if (loadError || (!ParsedTextComponent && this.state.hasAttemptedLoad)) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError || 'ParsedText not available'} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      // Fallback to regular Text component
      return (
        <Text style={style} {...parsedTextProps}>
          {children}
        </Text>
      );
    }

    // ParsedText module loaded successfully
    if (ParsedTextComponent) {
      return (
        <ParsedTextComponent
          style={style}
          {...parsedTextProps}
        >
          {children}
        </ParsedTextComponent>
      );
    }

    // Default state - attempt to load
    if (!this.state.hasAttemptedLoad) {
      this.loadParsedText();
    }
    
    // While waiting, render as regular Text
    return (
      <Text style={style} {...parsedTextProps}>
        {children}
      </Text>
    );
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyParsedText = () => {
  const [state, setState] = React.useState<{
    ParsedTextComponent: React.ComponentType<ParsedTextProps> | null;
    isLoading: boolean;
    loadError: string | null;
    hasAttemptedLoad: boolean;
  }>({
    ParsedTextComponent: null,
    isLoading: false,
    loadError: null,
    hasAttemptedLoad: false,
  });

  const loadParsedText = React.useCallback(async () => {
    if (state.ParsedTextComponent || state.isLoading || state.hasAttemptedLoad) {
      return state.ParsedTextComponent;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null, hasAttemptedLoad: true }));

    try {
      const ParsedTextModule = await LazyLoader.importModule(
        () => import('react-native-parsed-text'),
        'parsedtext'
      );

      const ParsedTextComponent = ParsedTextModule;

      if (!ParsedTextComponent) {
        throw new Error('ParsedText module not found');
      }

      setState({
        ParsedTextComponent,
        isLoading: false,
        loadError: null,
        hasAttemptedLoad: true,
      });

      return ParsedTextComponent;
    } catch (error) {
      console.warn('Failed to load ParsedText:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState({
        ParsedTextComponent: null,
        isLoading: false,
        loadError: errorMessage,
        hasAttemptedLoad: true,
      });
      return null;
    }
  }, [state.ParsedTextComponent, state.isLoading, state.hasAttemptedLoad]);

  React.useEffect(() => {
    loadParsedText();
  }, [loadParsedText]);

  return {
    ParsedTextComponent: state.ParsedTextComponent,
    isLoading: state.isLoading,
    loadError: state.loadError,
    hasAttemptedLoad: state.hasAttemptedLoad,
    loadParsedText,
  };
};

/**
 * Simple fallback ParsedText component
 * This can be used when ParsedText is not available
 */
export const FallbackParsedText: React.FC<ParsedTextProps> = ({ 
  children,
  style,
  ...props
}) => {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LazyParsedText;
