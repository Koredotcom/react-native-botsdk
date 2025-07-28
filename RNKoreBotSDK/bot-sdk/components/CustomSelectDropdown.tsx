import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface SelectDropdownProps {
  data: any[];
  onSelect: (selectedItem: any, index: number) => void;
  renderButton?: (selectedItem: any, isOpened: boolean) => React.ReactElement;
  renderItem?: (item: any, index: number, isSelected: boolean) => React.ReactElement;
  defaultButtonText?: string;
  disabled?: boolean;
  dropdownStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  rowStyle?: ViewStyle;
  rowTextStyle?: TextStyle;
  selectedRowColor?: string;
  dropdownBackgroundColor?: string;
  showsVerticalScrollIndicator?: boolean;
  search?: boolean;
  searchPlaceHolder?: string;
  // Enhanced customization props
  maxHeight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  selectedColor?: string;
  unselectedColor?: string;
  animationDuration?: number;
}

interface SelectDropdownState {
  isVisible: boolean;
  selectedItem: any;
  selectedIndex: number;
  buttonLayout: { x: number; y: number; width: number; height: number };
}

class CustomSelectDropdown extends React.Component<SelectDropdownProps, SelectDropdownState> {
  private fadeAnim: Animated.Value;
  private scaleAnim: Animated.Value;

  constructor(props: SelectDropdownProps) {
    super(props);
    
    this.state = {
      isVisible: false,
      selectedItem: null,
      selectedIndex: -1,
      buttonLayout: { x: 0, y: 0, width: 0, height: 0 },
    };
    
    this.fadeAnim = new Animated.Value(0);
    this.scaleAnim = new Animated.Value(0.95);
  }

  openDropdown = () => {
    const { disabled, data, animationDuration = 300 } = this.props;
    if (disabled || data.length === 0) return;
    
    this.setState({ isVisible: true });
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(this.scaleAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  closeDropdown = () => {
    const { animationDuration = 300 } = this.props;
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(this.scaleAnim, {
        toValue: 0.95,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ isVisible: false });
    });
  };

  handleItemPress = (item: any, index: number) => {
    this.setState({
      selectedItem: item,
      selectedIndex: index,
    });
    this.closeDropdown();
    this.props.onSelect?.(item, index);
  };

  handleButtonLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.setState({ buttonLayout: { x, y, width, height } });
  };

  renderDefaultButton = () => {
    const {
      borderColor = '#CCCCCC',
      borderRadius = 8,
      borderWidth = 1,
      buttonStyle = {},
      buttonTextStyle = {},
      selectedColor = '#007AFF',
      unselectedColor = '#333333',
      defaultButtonText = 'Select an option',
    } = this.props;
    const { selectedItem } = this.state;
    
    return (
      <View style={[styles.defaultButton, { borderColor, borderRadius, borderWidth }, buttonStyle]}>
        <Text 
          style={[
            styles.defaultButtonText, 
            { color: selectedItem ? selectedColor : unselectedColor },
            buttonTextStyle
          ]}
          numberOfLines={1}
        >
          {selectedItem?.title || selectedItem?.label || selectedItem?.name || defaultButtonText}
        </Text>
        <Text style={[styles.arrow, { color: borderColor }]}>▼</Text>
      </View>
    );
  };

  renderDefaultItem = (item: any, index: number, isSelected: boolean) => {
    const {
      selectedRowColor = '#E3F2FD',
      rowStyle = {},
      selectedColor = '#007AFF',
      unselectedColor = '#333333',
      rowTextStyle = {},
    } = this.props;
    
    return (
      <TouchableOpacity
        style={[
          styles.defaultRow,
          { backgroundColor: isSelected ? selectedRowColor : 'transparent' },
          rowStyle,
        ]}
        onPress={() => this.handleItemPress(item, index)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.defaultRowText,
            { color: isSelected ? selectedColor : unselectedColor },
            rowTextStyle,
          ]}
          numberOfLines={1}
        >
          {item?.title || item?.label || item?.name || item.toString()}
        </Text>
      </TouchableOpacity>
    );
  };

  getDropdownPosition = () => {
    const {
      data,
      maxHeight = 200,
      dropdownBackgroundColor = '#FFFFFF',
      borderRadius = 8,
      borderWidth = 1,
      borderColor = '#CCCCCC',
    } = this.props;
    const { buttonLayout } = this.state;
    
    const dropdownHeight = Math.min(data.length * 50 + 20, maxHeight);
    const spaceBelow = screenHeight - (buttonLayout.y + buttonLayout.height);
    const spaceAbove = buttonLayout.y;
    
    let top = buttonLayout.y + buttonLayout.height + 5;
    
    // If not enough space below, show above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      top = buttonLayout.y - dropdownHeight - 5;
    }
    
    return {
      position: 'absolute' as const,
      top,
      left: buttonLayout.x,
      width: Math.max(buttonLayout.width, 200),
      maxHeight,
      backgroundColor: dropdownBackgroundColor,
      borderRadius,
      borderWidth,
      borderColor,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      zIndex: 1000,
    };
  };

  render() {
    const {
      disabled = false,
      renderButton,
      renderItem,
      data,
      dropdownStyle = {},
      showsVerticalScrollIndicator = true,
    } = this.props;
    const { isVisible, selectedItem, selectedIndex } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.openDropdown}
          onLayout={this.handleButtonLayout}
          disabled={disabled}
          activeOpacity={0.7}
          style={[disabled && styles.disabled]}
        >
          {renderButton ? renderButton(selectedItem, isVisible) : this.renderDefaultButton()}
        </TouchableOpacity>

        <Modal
          visible={isVisible}
          transparent
          animationType="none"
          onRequestClose={this.closeDropdown}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={this.closeDropdown}
          >
            <Animated.View
              style={[
                this.getDropdownPosition(),
                dropdownStyle,
                {
                  opacity: this.fadeAnim,
                  transform: [{ scale: this.scaleAnim }],
                },
              ]}
            >
              <FlatList
                data={data}
                keyExtractor={(item, index) => `dropdown-item-${index}`}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                bounces={false}
                renderItem={({ item, index }) => {
                  const isSelected = index === selectedIndex;
                  return renderItem 
                    ? renderItem(item, index, isSelected)
                    : this.renderDefaultItem(item, index, isSelected);
                }}
              />
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  defaultButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  defaultButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
    color: '#666666',
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  defaultRow: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
    minHeight: 44,
    justifyContent: 'center',
  },
  defaultRowText: {
    fontSize: 16,
    color: '#333333',
  },
});

// Default export for compatibility with existing imports
export default CustomSelectDropdown;
export { CustomSelectDropdown }; 