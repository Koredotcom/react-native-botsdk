import React, { Component, ComponentType } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Popover
export interface PopoverProps {
  isVisible?: boolean;
  onRequestClose?: () => void;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  displayArea?: { x: number; y: number; width: number; height: number };
  arrowSize?: { width: number; height: number };
  arrowStyle?: any;
  popoverStyle?: any;
  backgroundStyle?: any;
  from?: React.RefObject<any> | { x: number; y: number; width: number; height: number } | React.ReactNode;
  children?: React.ReactNode;
  mode?: 'rn-modal' | 'js-modal' | 'tooltip';
  animationConfig?: any;
  verticalOffset?: number;
  debug?: boolean;
  onOpenStart?: () => void;
  onOpenComplete?: () => void;
  onCloseStart?: () => void;
  onCloseComplete?: () => void;
}

interface LazyPopoverState {
  PopoverModule: ComponentType<PopoverProps> | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyPopoverProps extends PopoverProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (popoverModule: ComponentType<PopoverProps> | null) => void;
}

/**
 * Lazy-loaded Popover component that dynamically imports 
 * react-native-popover-view only when needed
 */
export class LazyPopover extends Component<LazyPopoverProps, LazyPopoverState> {
  private mounted = true;

  constructor(props: LazyPopoverProps) {
    super(props);
    this.state = {
      PopoverModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadPopover();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadPopover() {
    if (this.state.PopoverModule || this.state.isLoading) {
      return this.state.PopoverModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const PopoverModule = await LazyLoader.importModule(
        () => import('react-native-popover-view'),
        'popover'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Popover = (PopoverModule as any)?.default || (PopoverModule as any)?.Popover || PopoverModule || null;

        if (!Popover) {
          throw new Error('Popover component not found in module');
        }

        this.setState({
          PopoverModule: Popover,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Popover);
        }

        return Popover;
      }
    } catch (error) {
      console.warn('Failed to load Popover:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          PopoverModule: null,
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
      ...popoverProps 
    } = this.props;
    
    const { PopoverModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading popover..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...popoverProps} />;
      }
      return <ErrorFallback error={`Popover unavailable: ${loadError}`} />;
    }

    // Show the actual Popover component
    if (PopoverModule) {
      return <PopoverModule {...popoverProps} />;
    }

    // Default loading state
    return <DefaultLoader text="Initializing popover..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyPopover = () => {
  const [state, setState] = React.useState<{
    PopoverModule: ComponentType<PopoverProps> | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    PopoverModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadPopover = React.useCallback(async () => {
    if (state.PopoverModule || state.isLoading) {
      return state.PopoverModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const PopoverModule = await LazyLoader.importModule(
        () => import('react-native-popover-view'),
        'popover'
      );

      const Popover = (PopoverModule as any)?.default || (PopoverModule as any)?.Popover || PopoverModule || null;

      if (!Popover) {
        throw new Error('Popover component not found in module');
      }

      setState({
        PopoverModule: Popover,
        isLoading: false,
        loadError: null,
      });

      return Popover;
    } catch (error) {
      console.warn('Failed to load Popover:', error);
      setState({
        PopoverModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.PopoverModule, state.isLoading]);

  React.useEffect(() => {
    loadPopover();
  }, [loadPopover]);

  return {
    PopoverModule: state.PopoverModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadPopover,
  };
};

/**
 * Simple fallback Popover using Modal
 */
export const FallbackPopover: React.FC<PopoverProps> = ({
  isVisible = false,
  onRequestClose,
  placement = 'auto',
  children,
  popoverStyle,
  backgroundStyle,
  from,
  arrowSize = { width: 16, height: 8 },
}) => {
  const screenDimensions = Dimensions.get('window');
  
  // Simple positioning logic for fallback
  const getPopoverPosition = () => {
    if (typeof from === 'object' && from && 'x' in from) {
      const fromRect = from as { x: number; y: number; width: number; height: number };
      let top = fromRect.y + fromRect.height + 10;
      let left = fromRect.x;

      // Adjust for screen boundaries
      if (top + 200 > screenDimensions.height) {
        top = fromRect.y - 200 - 10; // Show above
      }
      if (left + 200 > screenDimensions.width) {
        left = screenDimensions.width - 200 - 10; // Adjust left
      }

      return { top: Math.max(10, top), left: Math.max(10, left) };
    }

    // Default center positioning
    return {
      top: screenDimensions.height / 2 - 100,
      left: screenDimensions.width / 2 - 100,
    };
  };

  const position = getPopoverPosition();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={[styles.fallbackOverlay, backgroundStyle]}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <View
          style={[
            styles.fallbackPopover,
            {
              top: position.top,
              left: position.left,
            },
            popoverStyle,
          ]}
        >
          {/* Simple arrow */}
          <View style={[
            styles.fallbackArrow,
            {
              width: arrowSize.width,
              height: arrowSize.height,
            }
          ]} />
          
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fallbackOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  fallbackPopover: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 200,
    minWidth: 100,
  },
  fallbackArrow: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
});

export default LazyPopover;
