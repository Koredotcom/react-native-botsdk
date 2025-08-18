import React, { Component, ComponentType } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { LazyLoader, DefaultLoader, ErrorFallback } from '../utils/LazyLoader';

// Type definitions for the lazy-loaded Picker
export interface PickerProps {
  selectedValue?: any;
  onValueChange: (itemValue: any, itemIndex: number) => void;
  mode?: 'dialog' | 'dropdown';
  enabled?: boolean;
  prompt?: string;
  itemStyle?: any;
  style?: any;
  children?: React.ReactNode;
}

export interface PickerItemProps {
  label: string;
  value: any;
  color?: string;
  fontFamily?: string;
  style?: any;
}

interface LazyPickerState {
  PickerComponent: ComponentType<PickerProps> | null;
  PickerItem: ComponentType<PickerItemProps> | null;
  isLoading: boolean;
  loadError: string | null;
}

export interface LazyPickerProps extends PickerProps {
  fallbackComponent?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<{ error: string }>;
}

/**
 * Lazy-loaded Picker component that dynamically imports 
 * @react-native-picker/picker only when needed
 */
export class LazyPicker extends Component<LazyPickerProps, LazyPickerState> {
  private mounted = true;

  constructor(props: LazyPickerProps) {
    super(props);
    this.state = {
      PickerComponent: null,
      PickerItem: null,
      isLoading: false,
      loadError: null,
    };
  }

  componentDidMount() {
    this.loadPicker();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private async loadPicker() {
    if (this.state.PickerComponent || this.state.isLoading) {
      return;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Dynamic import with fallback for different module structures
      const PickerModule = await LazyLoader.importModule(
        () => import('@react-native-picker/picker'),
        'picker'
      );

      if (this.mounted) {
        // Handle different export patterns
        const PickerComponent = PickerModule?.Picker || PickerModule?.default?.Picker || null;
        const PickerItem = PickerModule?.Picker?.Item || PickerModule?.default?.Picker?.Item || null;

        if (!PickerComponent) {
          throw new Error('Picker component not found in module');
        }

        this.setState({
          PickerComponent,
          PickerItem,
          isLoading: false,
          loadError: null,
        });
      }
    } catch (error) {
      console.warn('Failed to load Picker:', error);
      
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
      children,
      ...pickerProps 
    } = this.props;
    
    const { PickerComponent, isLoading, loadError } = this.state;

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoader text="Loading picker..." />;
    }

    // Show error state
    if (loadError) {
      if (ErrorComponent) {
        return <ErrorComponent error={loadError} />;
      }
      if (FallbackComponent) {
        return <FallbackComponent {...pickerProps}>{children}</FallbackComponent>;
      }
      return <ErrorFallback error={`Picker unavailable: ${loadError}`} />;
    }

    // Show the actual Picker
    if (PickerComponent) {
      return <PickerComponent {...pickerProps}>{children}</PickerComponent>;
    }

    // Fallback while loading
    if (FallbackComponent) {
      return <FallbackComponent {...pickerProps}>{children}</FallbackComponent>;
    }

    return <DefaultLoader text="Initializing picker..." />;
  }
}

/**
 * Lazy Picker Item component
 */
export class LazyPickerItem extends Component<PickerItemProps> {
  render() {
    // This will be handled by the parent LazyPicker component
    return null;
  }
}

/**
 * Hook-based version for functional components
 */
export const useLazyPicker = () => {
  const [state, setState] = React.useState<{
    PickerComponent: ComponentType<PickerProps> | null;
    PickerItem: ComponentType<PickerItemProps> | null;
    isLoading: boolean;
    loadError: string | null;
  }>({
    PickerComponent: null,
    PickerItem: null,
    isLoading: false,
    loadError: null,
  });

  const loadPicker = React.useCallback(async () => {
    if (state.PickerComponent || state.isLoading) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, loadError: null }));

    try {
      const PickerModule = await LazyLoader.importModule(
        () => import('@react-native-picker/picker'),
        'picker'
      );

      const PickerComponent = PickerModule?.Picker || PickerModule?.default?.Picker || null;
      const PickerItem = PickerModule?.Picker?.Item || PickerModule?.default?.Picker?.Item || null;

      if (!PickerComponent) {
        throw new Error('Picker component not found in module');
      }

      setState({
        PickerComponent,
        PickerItem,
        isLoading: false,
        loadError: null,
      });
    } catch (error) {
      console.warn('Failed to load Picker:', error);
      setState({
        PickerComponent: null,
        PickerItem: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [state.PickerComponent, state.isLoading]);

  React.useEffect(() => {
    loadPicker();
  }, [loadPicker]);

  return {
    PickerComponent: state.PickerComponent,
    PickerItem: state.PickerItem,
    isLoading: state.isLoading,
    loadError: state.loadError,
    reload: loadPicker,
  };
};

/**
 * Simple fallback Picker using native components
 * This can be used when the actual Picker fails to load
 */
export const FallbackPicker: React.FC<PickerProps & { children?: React.ReactNode }> = ({
  selectedValue,
  onValueChange,
  mode = 'dropdown',
  children,
  style,
  prompt = 'Select an option',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [items, setItems] = React.useState<Array<{label: string, value: any}>>([]);

  React.useEffect(() => {
    // Extract items from children
    const extractedItems: Array<{label: string, value: any}> = [];
    React.Children.forEach(children, (child: any) => {
      if (child && child.props) {
        extractedItems.push({
          label: child.props.label || String(child.props.value),
          value: child.props.value,
        });
      }
    });
    setItems(extractedItems);
  }, [children]);

  const selectedItem = items.find(item => item.value === selectedValue);

  const handleItemSelect = (item: {label: string, value: any}, index: number) => {
    onValueChange(item.value, index);
    setIsVisible(false);
  };

  return (
    <View style={[styles.fallbackContainer, style]}>
      <TouchableOpacity
        style={styles.fallbackButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.fallbackButtonText}>
          {selectedItem ? selectedItem.label : prompt}
        </Text>
        <Text style={styles.fallbackArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.fallbackModalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.fallbackModalContent}>
            <Text style={styles.fallbackModalTitle}>{prompt}</Text>
            <FlatList
              data={items}
              keyExtractor={(item, index) => `${item.value}_${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.fallbackModalItem,
                    item.value === selectedValue && styles.fallbackModalItemSelected
                  ]}
                  onPress={() => handleItemSelect(item, index)}
                >
                  <Text style={[
                    styles.fallbackModalItemText,
                    item.value === selectedValue && styles.fallbackModalItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

/**
 * Fallback Picker Item component
 */
export const FallbackPickerItem: React.FC<PickerItemProps> = ({ label, value }) => {
  // This is just a placeholder - the actual rendering is handled by FallbackPicker
  return null;
};

// Attach Item to LazyPicker for API compatibility
(LazyPicker as any).Item = LazyPickerItem;
(FallbackPicker as any).Item = FallbackPickerItem;

const styles = StyleSheet.create({
  fallbackContainer: {
    minHeight: 40,
  },
  fallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fallbackButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  fallbackArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  fallbackModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxWidth: '90%',
    maxHeight: '70%',
    minWidth: 250,
  },
  fallbackModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  fallbackModalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fallbackModalItemSelected: {
    backgroundColor: '#4ECDC4',
  },
  fallbackModalItemText: {
    fontSize: 16,
    color: '#333',
  },
  fallbackModalItemTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
});

export default LazyPicker;
