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
  renderItem?: (item: any, index: number, isSelected: boolean, onItemPress: (item: any, index: number) => void) => React.ReactElement;
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
  isVisible: boolean;
  selectedItem: any;
  selectedIndex: number;
  buttonLayout: { x: number; y: number; width: number; height: number };
}

class CustomSelectDropdown extends React.Component<SelectDropdownProps, SelectDropdownState> {
  private fadeAnim: Animated.Value;
  private scaleAnim: Animated.Value;
  private buttonRef: React.RefObject<View>;
  private flatListRef: React.RefObject<FlatList>;

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
    this.buttonRef = React.createRef();
    this.flatListRef = React.createRef();
  }

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

  scrollToSelectedItem = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    
    // Use controlled value if provided
    const isControlled = this.props.hasOwnProperty('value');
    const currentSelectedIndex = isControlled 
      ? data.findIndex(item => item === this.props.value || item?.value === this.props.value?.value || item?.title === this.props.value?.title)
      : selectedIndex;
    
    if (this.flatListRef.current && currentSelectedIndex >= 0 && currentSelectedIndex < data.length) {
      console.log('Scrolling to selected item at index:', currentSelectedIndex);
      // Use setTimeout to ensure the FlatList is fully rendered
      setTimeout(() => {
        try {
          this.flatListRef.current?.scrollToIndex({
            index: currentSelectedIndex,
            animated: true,
            viewPosition: 0, // 0 = top, 0.5 = center, 1 = bottom
          });
        } catch (error) {
          // Fallback to scrollToOffset if scrollToIndex fails
          this.flatListRef.current?.scrollToOffset({
            offset: currentSelectedIndex * 45, // Updated to match actual item height
            animated: true,
          });
        }
      }, 100);
    }
  };

  openDropdown = () => {
    const { disabled, data, animationDuration = 300 } = this.props;
    if (disabled || data.length === 0) return;
    
    // Measure button position in window coordinates
    if (this.buttonRef.current) {
      this.buttonRef.current.measureInWindow((x, y, width, height) => {
        this.setState({ 
          isVisible: true,
          buttonLayout: { x, y, width, height }
        });
        
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
        ]).start(() => {
          // Scroll to selected item after animation completes
          this.scrollToSelectedItem();
        });
      });
    } else {
      // Fallback to existing behavior
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
      ]).start(() => {
        // Scroll to selected item after animation completes
        this.scrollToSelectedItem();
      });
    }
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
      value,
    } = this.props;
    const { selectedItem } = this.state;
    
    // Use controlled value if value prop is provided (even if undefined), otherwise use internal state
    const isControlled = this.props.hasOwnProperty('value');
    const currentSelectedItem = isControlled ? value : selectedItem;
    
    return (
      <View style={[styles.defaultButton, { borderColor, borderRadius, borderWidth }, buttonStyle]}>
        <Text 
          style={[
            styles.defaultButtonText, 
            { color: currentSelectedItem ? selectedColor : unselectedColor },
            buttonTextStyle
          ]}
          numberOfLines={1}
        >
          {currentSelectedItem?.title || currentSelectedItem?.label || currentSelectedItem?.name || defaultButtonText}
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
    
    // Position below the button by default
    let top = buttonLayout.y + buttonLayout.height + 5;
    
    // If not enough space below, show above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      top = buttonLayout.y - dropdownHeight - 5;
    }
    
    // Calculate centered horizontal position
    const dropdownWidth = Math.max(buttonLayout.width, 200);
    const buttonCenterX = buttonLayout.x + (buttonLayout.width / 2);
    const left = Math.max(10, Math.min(
      screenWidth - dropdownWidth - 10,
      buttonCenterX - (dropdownWidth / 2)
    ));
    
    console.log('Dropdown positioning:', {
      buttonLayout,
      dropdownWidth,
      buttonCenterX,
      left,
      top,
      screenWidth,
      screenHeight
    });
    
    return {
      position: 'absolute' as const,
      top,
      left,
      width: dropdownWidth,
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
      value, // Add value prop
    } = this.props;
    const { isVisible, selectedItem, selectedIndex } = this.state;

    // Use controlled value if value prop is provided (even if undefined), otherwise use internal state
    const isControlled = this.props.hasOwnProperty('value');
    const currentSelectedItem = isControlled ? value : selectedItem;
    const currentSelectedIndex = isControlled 
      ? data.findIndex(item => item === value || item?.value === value?.value || item?.title === value?.title)
      : selectedIndex;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          ref={this.buttonRef}
          onPress={this.openDropdown}
          disabled={disabled}
          activeOpacity={0.7}
          style={[disabled && styles.disabled]}
        >
          {renderButton ? renderButton(currentSelectedItem, isVisible) : this.renderDefaultButton()}
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
                ref={this.flatListRef}
                data={data}
                keyExtractor={(item, index) => `dropdown-item-${index}`}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                bounces={false}
                getItemLayout={(data, index) => ({
                  length: 45, // Actual item height from DropdownTemplate styles
                  offset: 45 * index,
                  index,
                })}
                onScrollToIndexFailed={(info) => {
                  console.log('ScrollToIndex failed:', info);
                  // Fallback: scroll to approximate position
                  this.flatListRef.current?.scrollToOffset({
                    offset: info.index * 45,
                    animated: true,
                  });
                }}
                renderItem={({ item, index }) => {
                  const isSelected = index === currentSelectedIndex;
                  return renderItem 
                    ? renderItem(item, index, isSelected, this.handleItemPress)
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