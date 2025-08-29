import React, { Component, ComponentType } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded SVG components
export interface SvgProps {
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  style?: any;
  children?: React.ReactNode;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
}

export interface SvgPathProps {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  fillRule?: 'evenodd' | 'nonzero';
  clipRule?: 'evenodd' | 'nonzero';
  style?: any;
}

export interface SvgRectProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  rx?: number | string;
  ry?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  style?: any;
}

export interface SvgCircleProps {
  cx?: number | string;
  cy?: number | string;
  r?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  style?: any;
}

export interface SvgTextProps {
  x?: number | string;
  y?: number | string;
  fontSize?: number | string;
  fontFamily?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  fill?: string;
  style?: any;
  children?: React.ReactNode;
}

export interface SvgModule {
  default: ComponentType<SvgProps>;
  Svg: ComponentType<SvgProps>;
  Path: ComponentType<SvgPathProps>;
  Rect: ComponentType<SvgRectProps>;
  Circle: ComponentType<SvgCircleProps>;
  Text: ComponentType<SvgTextProps>;
  G: ComponentType<any>;
  Defs: ComponentType<any>;
  Use: ComponentType<any>;
  Image: ComponentType<any>;
  Pattern: ComponentType<any>;
  SvgCssUri: ComponentType<any>;
  [key: string]: ComponentType<any>;
}

interface LazySvgState {
  SvgModule: SvgModule | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazySvgProps extends SvgProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
  onModuleLoaded?: (svgModule: SvgModule | null) => void;
}

/**
 * Lazy-loaded SVG component that dynamically imports 
 * react-native-svg only when needed
 */
export class LazySvg extends Component<LazySvgProps, LazySvgState> {
  private mounted = true;

  constructor(props: LazySvgProps) {
    super(props);
    this.state = {
      SvgModule: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadSvg();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public async loadSvg() {
    if (this.state.SvgModule || this.state.isLoading) {
      return this.state.SvgModule;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const SvgModule = await LazyLoader.importModule(
        () => import('react-native-svg'),
        'svg'
      );

      if (this.mounted) {
        // Handle different export patterns
        const Svg = SvgModule?.default || SvgModule?.Svg || SvgModule || null;

        if (!Svg) {
          throw new Error('SVG component not found in module');
        }

        // Create module object with all SVG components
        const svgComponents: SvgModule = {
          default: Svg,
          Svg: SvgModule?.Svg || Svg,
          Path: SvgModule?.Path || null,
          Rect: SvgModule?.Rect || null,
          Circle: SvgModule?.Circle || null,
          Text: SvgModule?.Text || null,
          G: SvgModule?.G || null,
          Defs: SvgModule?.Defs || null,
          Use: SvgModule?.Use || null,
          Image: SvgModule?.Image || null,
          Pattern: SvgModule?.Pattern || null,
          SvgCssUri: SvgModule?.SvgCssUri || null,
          ...SvgModule, // Include any other exports
        };

        this.setState({
          SvgModule: svgComponents,
          isLoading: false,
          loadError: null,
        });

        // Notify parent components
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(svgComponents);
        }

        return svgComponents;
      }
    } catch (error) {
      console.warn('Failed to load SVG:', error);
      
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.setState({
          SvgModule: null,
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
      children,
      ...svgProps 
    } = this.props;
    
    const { SvgModule, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading SVG..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...svgProps}>{children}</FallbackComponent>;
      }
      return <ErrorFallback error={`SVG unavailable: ${loadError}`} />;
    }

    // Show the actual SVG component
    if (SvgModule && SvgModule.default) {
      const SvgComponent = SvgModule.default;
      return <SvgComponent {...svgProps}>{children}</SvgComponent>;
    }

    // Default loading state
    return <DefaultLoader text="Initializing SVG..." />;
  }
}

// Lazy SVG sub-components
export class LazySvgPath extends Component<SvgPathProps> {
  render() {
    // This will be handled by the parent LazySvg context
    return null;
  }
}

export class LazySvgRect extends Component<SvgRectProps> {
  render() {
    return null;
  }
}

export class LazySvgCircle extends Component<SvgCircleProps> {
  render() {
    return null;
  }
}

export class LazySvgText extends Component<SvgTextProps> {
  render() {
    return null;
  }
}

// Attach sub-components to LazySvg for API compatibility
(LazySvg as any).Path = LazySvgPath;
(LazySvg as any).Rect = LazySvgRect;
(LazySvg as any).Circle = LazySvgCircle;
(LazySvg as any).Text = LazySvgText;

/**
 * Hook-based version for functional components
 */
export const useLazySvg = () => {
  const [state, setState] = React.useState<{
    SvgModule: SvgModule | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    SvgModule: null,
    isLoading: false,
    loadError: null,
  });

  const loadSvg = React.useCallback(async () => {
    if (state.SvgModule || state.isLoading) {
      return state.SvgModule;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const SvgModule = await LazyLoader.importModule(
        () => import('react-native-svg'),
        'svg'
      );

      const Svg = SvgModule?.default || SvgModule?.Svg || SvgModule || null;

      if (!Svg) {
        throw new Error('SVG component not found in module');
      }

      const svgComponents: SvgModule = {
        default: Svg,
        Svg: SvgModule?.Svg || Svg,
        Path: SvgModule?.Path || null,
        Rect: SvgModule?.Rect || null,
        Circle: SvgModule?.Circle || null,
        Text: SvgModule?.Text || null,
        G: SvgModule?.G || null,
        Defs: SvgModule?.Defs || null,
        Use: SvgModule?.Use || null,
        Image: SvgModule?.Image || null,
        Pattern: SvgModule?.Pattern || null,
        SvgCssUri: SvgModule?.SvgCssUri || null,
        ...SvgModule,
      };

      setState({
        SvgModule: svgComponents,
        isLoading: false,
        loadError: null,
      });

      return svgComponents;
    } catch (error) {
      console.warn('Failed to load SVG:', error);
      setState({
        SvgModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [state.SvgModule, state.isLoading]);

  React.useEffect(() => {
    loadSvg();
  }, [loadSvg]);

  return {
    SvgModule: state.SvgModule,
    Svg: state.SvgModule?.Svg || null,
    Path: state.SvgModule?.Path || null,
    Rect: state.SvgModule?.Rect || null,
    Circle: state.SvgModule?.Circle || null,
    Text: state.SvgModule?.Text || null,
    G: state.SvgModule?.G || null,
    Defs: state.SvgModule?.Defs || null,
    Use: state.SvgModule?.Use || null,
    Image: state.SvgModule?.Image || null,
    Pattern: state.SvgModule?.Pattern || null,
    SvgCssUri: state.SvgModule?.SvgCssUri || null,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadSvg,
  };
};

/**
 * Simple fallback SVG using basic React Native components
 */
export const FallbackSvg: React.FC<SvgProps> = ({
  width = 100,
  height = 100,
  children,
  style,
}) => {
  return (
    <View 
      style={[
        styles.fallbackContainer, 
        { width: Number(width), height: Number(height) },
        style
      ]}
    >
      <Text style={styles.fallbackText}>SVG</Text>
      {children}
    </View>
  );
};

export const FallbackSvgPath: React.FC<SvgPathProps> = () => null;
export const FallbackSvgRect: React.FC<SvgRectProps> = ({ width, height, fill }) => (
  <View style={[
    styles.fallbackRect, 
    { width: Number(width), height: Number(height), backgroundColor: fill || '#ccc' }
  ]} />
);
export const FallbackSvgCircle: React.FC<SvgCircleProps> = ({ r, fill }) => (
  <View style={[
    styles.fallbackCircle, 
    { 
      width: Number(r) * 2, 
      height: Number(r) * 2, 
      borderRadius: Number(r),
      backgroundColor: fill || '#ccc' 
    }
  ]} />
);
export const FallbackSvgText: React.FC<SvgTextProps> = ({ children, fontSize, fill }) => (
  <Text style={[styles.fallbackSvgText, { fontSize: Number(fontSize), color: fill }]}>
    {children}
  </Text>
);

// Attach fallback sub-components
(FallbackSvg as any).Path = FallbackSvgPath;
(FallbackSvg as any).Rect = FallbackSvgRect;
(FallbackSvg as any).Circle = FallbackSvgCircle;
(FallbackSvg as any).Text = FallbackSvgText;
(FallbackSvg as any).G = ({ children }: any) => <View>{children}</View>;
(FallbackSvg as any).Defs = () => null;
(FallbackSvg as any).Use = () => null;
(FallbackSvg as any).Image = () => <View style={styles.fallbackImage} />;
(FallbackSvg as any).Pattern = () => null;

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    // Circle styles handled in component
  },
  fallbackSvgText: {
    fontSize: 14,
    color: '#333',
  },
  fallbackImage: {
    width: 20,
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
});

export default LazySvg;
