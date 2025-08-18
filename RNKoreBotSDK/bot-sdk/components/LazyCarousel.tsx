import React, { Component, ComponentType } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Carousel
export interface CarouselProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  width?: number;
  height?: number;
  style?: any;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  scrollAnimationDuration?: number;
  onSnapToItem?: (index: number) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  enabled?: boolean;
  pagingEnabled?: boolean;
  snapEnabled?: boolean;
  vertical?: boolean;
  mode?: 'parallax' | 'stack' | 'normal';
  modeConfig?: any;
  customConfig?: any;
  defaultIndex?: number;
  windowSize?: number;
  autoPlayReverse?: boolean;
  testID?: string;
  panGestureHandlerProps?: any;
  withAnimation?: any;
}

interface LazyCarouselState {
  CarouselComponent: ComponentType<CarouselProps> | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyCarouselProps extends CarouselProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (carouselModule: ComponentType<CarouselProps> | null) => void;
}

/**
 * Lazy-loaded Carousel component that dynamically imports 
 * react-native-reanimated-carousel only when needed
 */
export class LazyCarousel extends Component<LazyCarouselProps, LazyCarouselState> {
  private mounted = true;

  constructor(props: LazyCarouselProps) {
    super(props);
    this.state = {
      CarouselComponent: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadCarousel();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadCarousel() {
    if (this.state.CarouselComponent || this.state.isLoading) {
      return this.state.CarouselComponent;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const CarouselModule = await LazyLoader.importModule(
        () => import('react-native-reanimated-carousel'),
        'carousel'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Carousel = CarouselModule?.default || CarouselModule || null;

        if (!Carousel) {
          throw new Error('Carousel component not found in module');
        }

        this.setState({
          CarouselComponent: Carousel,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Carousel);
        }

        return Carousel;
      }
    } catch (error) {
      console.warn('Failed to load Carousel:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          CarouselComponent: null,
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
      ...carouselProps 
    } = this.props;
    
    const { CarouselComponent, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading carousel..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...carouselProps} />;
      }
      return <ErrorFallback error={`Carousel unavailable: ${loadError}`} />;
    }

    // Show the actual Carousel component
    if (CarouselComponent) {
      return <CarouselComponent {...carouselProps} />;
    }

    // Default loading state
    return <DefaultLoader text="Initializing carousel..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyCarousel = () => {
  const [state, setState] = React.useState<{
    CarouselComponent: ComponentType<CarouselProps> | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    CarouselComponent: null,
    isLoading: false,
    loadError: null,
  });

  const loadCarousel = React.useCallback(async () => {
    if (state.CarouselComponent || state.isLoading) {
      return state.CarouselComponent;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const CarouselModule = await LazyLoader.importModule(
        () => import('react-native-reanimated-carousel'),
        'carousel'
      );

      const Carousel = CarouselModule?.default || CarouselModule || null;

      if (!Carousel) {
        throw new Error('Carousel component not found in module');
      }

      setState({
        CarouselComponent: Carousel,
        isLoading: false,
        loadError: null,
      });

      return Carousel;
    } catch (error) {
      console.warn('Failed to load Carousel:', error);
      setState({
        CarouselComponent: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.CarouselComponent, state.isLoading]);

  React.useEffect(() => {
    loadCarousel();
  }, [loadCarousel]);

  return {
    CarouselComponent: state.CarouselComponent,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadCarousel,
  };
};

/**
 * Simple fallback Carousel using ScrollView
 * This can be used when the carousel fails to load
 */
export const FallbackCarousel: React.FC<CarouselProps> = ({
  data,
  renderItem,
  width = Dimensions.get('window').width,
  height = 200,
  style,
  vertical = false,
  pagingEnabled = true,
  onSnapToItem,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const dimension = vertical ? layoutMeasurement.height : layoutMeasurement.width;
    const newIndex = Math.round((vertical ? contentOffset.y : contentOffset.x) / dimension);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < data.length) {
      setCurrentIndex(newIndex);
      if (onSnapToItem) {
        onSnapToItem(newIndex);
      }
    }
  };

  return (
    <View style={[styles.fallbackContainer, style]}>
      <ScrollView
        horizontal={!vertical}
        pagingEnabled={pagingEnabled}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={vertical ? { height } : { width }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.fallbackItem,
              vertical 
                ? { width, height: height / data.length }
                : { width: width / data.length, height }
            ]}
          >
            {renderItem({ item, index })}
          </View>
        ))}
      </ScrollView>
      
      {/* Simple pagination dots */}
      <View style={[
        styles.paginationContainer, 
        vertical ? styles.paginationVertical : styles.paginationHorizontal
      ]}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    position: 'relative',
  },
  fallbackItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationHorizontal: {
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationVertical: {
    right: 10,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 4,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default LazyCarousel;
