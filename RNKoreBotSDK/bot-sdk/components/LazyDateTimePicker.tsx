import React, { Component, ComponentType } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded DateTimePicker
export interface DateTimePickerProps {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  is24Hour?: boolean;
  display?: 'default' | 'spinner' | 'compact' | 'inline';
  minimumDate?: Date;
  maximumDate?: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  style?: any;
}

interface LazyDateTimePickerState {
  DateTimePickerComponent: ComponentType<DateTimePickerProps> | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyDateTimePickerProps extends DateTimePickerProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
}

/**
 * Lazy-loaded DateTimePicker component that dynamically imports 
 * @react-native-community/datetimepicker only when needed
 */
export class LazyDateTimePicker extends Component<
  LazyDateTimePickerProps,
  LazyDateTimePickerState
> {
  private mounted = true;

  constructor(props: LazyDateTimePickerProps) {
    super(props);
    this.state = {
      DateTimePickerComponent: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadDateTimePicker();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private async loadDateTimePicker() {
    if (this.state.DateTimePickerComponent || this.state.isLoading) {
      return;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const DateTimePickerModule = await LazyLoader.importModule(
        () => import('@react-native-community/datetimepicker'),
        'datetimepicker'
      );

      if (this.mounted) {
        // Handle different export patterns
        const DateTimePickerComponent = 
          DateTimePickerModule?.default || 
          DateTimePickerModule || 
          null;

        if (!DateTimePickerComponent) {
          throw new Error('DateTimePicker component not found in module');
        }

        this.setState({
          DateTimePickerComponent,
          isLoading: false,
          loadError: null,
        });
      }
    } catch (error) {
      console.warn('Failed to load DateTimePicker:', error);
      
      if (this.mounted) {
        this.setState({
          isLoading: false,
          loadError: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  render() {
    const { 
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
      ...dateTimePickerProps 
    } = this.props;
    
    const { DateTimePickerComponent, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading date picker..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...dateTimePickerProps} />;
      }
      return <ErrorFallback error={`Date picker unavailable: ${loadError}`} />;
    }

    // Show the actual DateTimePicker
    if (DateTimePickerComponent) {
      return <DateTimePickerComponent {...dateTimePickerProps} />;
    }

    // Fallback while loading
    if (FallbackComponent) {
      return <FallbackComponent {...dateTimePickerProps} />;
    }

    return <DefaultLoader text="Initializing date picker..." />;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyDateTimePicker = () => {
  const [state, setState] = React.useState<{
    DateTimePickerComponent: ComponentType<DateTimePickerProps> | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    DateTimePickerComponent: null,
    isLoading: false,
    loadError: null,
  });

  const loadDateTimePicker = React.useCallback(async () => {
    if (state.DateTimePickerComponent || state.isLoading) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const DateTimePickerModule = await LazyLoader.importModule(
        () => import('@react-native-community/datetimepicker'),
        'datetimepicker'
      );

      const DateTimePickerComponent = 
        DateTimePickerModule?.default || 
        DateTimePickerModule || 
        null;

      if (!DateTimePickerComponent) {
        throw new Error('DateTimePicker component not found in module');
      }

      setState({
        DateTimePickerComponent,
        isLoading: false,
        loadError: null,
      });
    } catch (error) {
      console.warn('Failed to load DateTimePicker:', error);
      setState({
        DateTimePickerComponent: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [state.DateTimePickerComponent, state.isLoading]);

  React.useEffect(() => {
    loadDateTimePicker();
  }, [loadDateTimePicker]);

  return {
    DateTimePickerComponent: state.DateTimePickerComponent,
    isLoading: state.isLoading,
    loadError: state.loadError,
    reload: loadDateTimePicker,
  };
};

/**
 * Simple fallback DateTimePicker using native inputs
 * This can be used when the actual DateTimePicker fails to load
 */
export const FallbackDateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  mode = 'date',
  onChange,
  style,
}) => {
  const handlePress = () => {
    // On platforms where we can't load the picker, 
    // we can trigger a basic date/time selection
    if (Platform.OS === 'web') {
      // For web, you could implement a basic HTML input fallback
      console.log('Fallback: Use native browser date picker');
    } else {
      // For mobile, you might want to show an alert or modal
      console.log('Fallback: DateTimePicker not available');
    }
  };

  return (
    <View style={[styles.fallbackContainer, style]}>
      <Text style={styles.fallbackText}>
        {mode === 'time' ? 'Time' : 'Date'} Picker Unavailable
      </Text>
      <Text style={styles.fallbackValue}>
        {mode === 'time' 
          ? value.toLocaleTimeString() 
          : value.toLocaleDateString()
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fallbackValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default LazyDateTimePicker;
