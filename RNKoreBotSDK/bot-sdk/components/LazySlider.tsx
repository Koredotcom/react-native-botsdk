import React, { Component } from 'react';
import { View } from 'react-native';
import { LazyLoader } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Slider - using flexible types to match @react-native-community/slider
export interface SliderModule {
  default: React.ComponentType<SliderProps>;
}

export interface SliderProps {
  style?: any;
  disabled?: boolean;
  maximumValue?: number;
  minimumTrackTintColor?: string;
  minimumValue?: number;
  onSlidingComplete?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onValueChange?: (value: number) => void;
  step?: number;
  maximumTrackTintColor?: string;
  testID?: string;
  value?: number;
  thumbStyle?: any;
  trackStyle?: any;
  minimumTrackStyle?: any;
  maximumTrackStyle?: any;
  debugTouchArea?: boolean;
  animateTransitions?: boolean;
  animationType?: 'spring' | 'timing';
  orientation?: 'horizontal' | 'vertical';
  thumbTouchSize?: { width: number; height: number };
  thumbImage?: any;
  trackImage?: any;
  minimumTrackImage?: any;
  maximumTrackImage?: any;
  [key: string]: any; // Allow any additional props
}

interface LazySliderState {
  SliderComponent: React.ComponentType<SliderProps> | null;
  isLoading: boolean;
  loadError: string | null;
  hasAttemptedLoad: boolean;
}

export interface LazySliderProps extends SliderProps {
  autoLoad?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (sliderComponent: React.ComponentType<SliderProps> | null) => void;
  hideUI?: boolean; // When true, component renders nothing if module fails to load
}

/**
 * Lazy-loaded Slider component that dynamically imports 
 * @react-native-community/slider only when needed
 */
export class LazySlider extends Component<LazySliderProps, LazySliderState> {
  private mounted = true;

  constructor(props: LazySliderProps) {
    super(props);
    this.state = {
      SliderComponent: null,
      isLoading: false,
      loadError: null,
      hasAttemptedLoad: false,
    };
  }

  componentDidMount() {
    if (this.props.autoLoad !== false) {
      // Add a small delay to prevent immediate loading issues
      setTimeout(() => {
        this.loadSlider();
      }, 10);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadSlider() {
    if (this.state.SliderComponent || this.state.isLoading || this.state.hasAttemptedLoad) {
      return this.state.SliderComponent;
    }

    this.setState({ isLoading: true, loadError: null, hasAttemptedLoad: true });

    try {
      // Dynamic import with fallback for different module structures
      const SliderModule = await LazyLoader.importModule(
        () => import('@react-native-community/slider'),
        'slider'
      );

      if (this.mounted) {
        // Slider module is already the default export from LazyLoader
        const SliderComponent = SliderModule as unknown as React.ComponentType<SliderProps>;

        if (!SliderComponent) {
          throw new Error('Slider module not found');
        }

        this.setState({
          SliderComponent,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(SliderComponent);
        }

        return SliderComponent;
      }
    } catch (error) {
      console.warn('Failed to load Slider:', error);
      
      if (this.mounted) {
        let errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        this.setState({
          SliderComponent: null,
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
      autoLoad,
      onModuleLoaded,
      ...sliderProps
    } = this.props;
    
    const { SliderComponent, isLoading, loadError } = this.state;

    // If hideUI is true, render nothing visually but still load the module
    if (hideUI) {
      return null;
    }

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      // Show a minimal loading placeholder that matches slider dimensions
      return (
        <View 
          style={[
            { 
              height: 40, 
              justifyContent: 'center', 
              alignItems: 'center',
              opacity: 0.5 
            }, 
            sliderProps.style
          ]} 
        />
      );
    }

    // Show error state or fallback
    if (loadError || (!SliderComponent && this.state.hasAttemptedLoad)) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError || 'Slider not available'} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      // Fallback to empty view with same dimensions
      return (
        <View 
          style={[
            { 
              height: 40, 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: 4
            }, 
            sliderProps.style
          ]} 
        />
      );
    }

    // Slider module loaded successfully
    if (SliderComponent) {
      return (
        <SliderComponent
          {...sliderProps}
        />
      );
    }

    // Default state - attempt to load
    if (!this.state.hasAttemptedLoad) {
      this.loadSlider();
    }
    
    // While waiting, render placeholder
    return (
      <View 
        style={[
          { 
            height: 40, 
            justifyContent: 'center', 
            alignItems: 'center',
            opacity: 0.5 
          }, 
          sliderProps.style
        ]} 
      />
    );
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazySlider = () => {
  const [state, setState] = React.useState<{
    SliderComponent: React.ComponentType<SliderProps> | null;
    isLoading: boolean;
    loadError: string | null;
    hasAttemptedLoad: boolean;
  }>({
    SliderComponent: null,
    isLoading: false,
    loadError: null,
    hasAttemptedLoad: false,
  });

  const loadSlider = React.useCallback(async () => {
    if (state.SliderComponent || state.isLoading || state.hasAttemptedLoad) {
      return state.SliderComponent;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null, hasAttemptedLoad: true }));

    try {
      const SliderModule = await LazyLoader.importModule(
        () => import('@react-native-community/slider'),
        'slider'
      );

      const SliderComponent = SliderModule as unknown as React.ComponentType<SliderProps>;

      if (!SliderComponent) {
        throw new Error('Slider module not found');
      }

      setState({
        SliderComponent,
        isLoading: false,
        loadError: null,
        hasAttemptedLoad: true,
      });

      return SliderComponent;
    } catch (error) {
      console.warn('Failed to load Slider:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState({
        SliderComponent: null,
        isLoading: false,
        loadError: errorMessage,
        hasAttemptedLoad: true,
      });
      return null;
    }
  }, [state.SliderComponent, state.isLoading, state.hasAttemptedLoad]);

  React.useEffect(() => {
    loadSlider();
  }, [loadSlider]);

  return {
    SliderComponent: state.SliderComponent,
    isLoading: state.isLoading,
    loadError: state.loadError,
    hasAttemptedLoad: state.hasAttemptedLoad,
    loadSlider,
  };
};

/**
 * Simple fallback Slider component
 * This can be used when Slider is not available
 */
export const FallbackSlider: React.FC<SliderProps> = ({ 
  style,
  value = 0,
  minimumValue = 0,
  maximumValue = 1,
  onValueChange,
  ...props
}) => {
  return (
    <View 
      style={[
        { 
          height: 40, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: 4,
          paddingHorizontal: 16
        }, 
        style
      ]} 
      {...props}
    >
      {/* Simple visual representation */}
      <View style={{
        width: '100%',
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        position: 'relative'
      }}>
        <View style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 4,
          backgroundColor: '#007AFF',
          borderRadius: 2,
          width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`
        }} />
        <View style={{
          position: 'absolute',
          left: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
          top: -6,
          width: 16,
          height: 16,
          backgroundColor: '#007AFF',
          borderRadius: 8,
          marginLeft: -8
        }} />
      </View>
    </View>
  );
};

export default LazySlider;
