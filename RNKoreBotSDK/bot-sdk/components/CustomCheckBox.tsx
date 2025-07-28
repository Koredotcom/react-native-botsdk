import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  Text,
} from 'react-native';

interface CustomCheckBoxProps {
  // @react-native-community/checkbox props
  style?: ViewStyle;
  boxType?: 'square' | 'circle';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  lineWidth?: number;
  hideBox?: boolean;
  animationDuration?: number;
  onAnimationType?: 'stroke' | 'fill' | 'bounce' | 'flat' | 'one-stroke' | 'fade';
  offAnimationType?: 'stroke' | 'fill' | 'bounce' | 'flat' | 'one-stroke' | 'fade';
  tintColor?: string;
  onCheckColor?: string;
  onFillColor?: string;
  onTintColor?: string;
  disabled?: boolean;
  
  // react-native-check-box props (for compatibility)
  isChecked?: boolean;
  onClick?: () => void;
  checkBoxColor?: string;
  
  // Enhanced color customization (similar to RadioButton)
  selectedColor?: string; // Color for checkmark and selected border
  unselectedColor?: string; // Color for unselected border
  selectedBackgroundColor?: string; // Background color when selected
  size?: number; // Checkbox size
  borderWidth?: number; // Border thickness
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  style,
  boxType = 'square',
  value,
  onValueChange,
  lineWidth = 2,
  hideBox = false,
  animationDuration = 0.5,
  onAnimationType = 'stroke',
  offAnimationType = 'stroke',
  tintColor = '#aaaaaa',
  onCheckColor = '#007aff',
  onFillColor = 'transparent',
  onTintColor = '#007aff',
  disabled = false,
  
  // react-native-check-box compatibility
  isChecked,
  onClick,
  checkBoxColor,
  
  // Enhanced color customization
  selectedColor = '#007AFF', // Default blue
  unselectedColor = '#CCCCCC', // Default gray
  selectedBackgroundColor = 'transparent',
  size = 24,
  borderWidth = 2,
}) => {
  // Support both APIs: prefer value over isChecked for @react-native-community/checkbox compatibility
  const isSelected = value !== undefined ? value : (isChecked || false);
  
  const animatedValue = React.useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSelected ? 1 : 0,
      duration: animationDuration * 1000,
      useNativeDriver: false,
    }).start();
  }, [isSelected, animationDuration, animatedValue]);

  const handlePress = () => {
    if (disabled) return;
    
    // Call appropriate callback based on which props were provided
    if (onClick) {
      onClick();
    } else if (onValueChange) {
      onValueChange(!isSelected);
    }
  };

  // Color priority: new props > legacy props > defaults
  const effectiveCheckColor = selectedColor || checkBoxColor || onCheckColor;
  const effectiveUnselectedColor = unselectedColor || tintColor;
  const effectiveSelectedColor = selectedColor || onTintColor || checkBoxColor; // Use selectedColor for border when selected
  const effectiveSelectedBackground = selectedBackgroundColor || onFillColor;
  const effectiveBorderWidth = borderWidth || lineWidth;
  const effectiveSize = size;

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [effectiveUnselectedColor, effectiveSelectedColor],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', effectiveSelectedBackground],
  });

  if (hideBox) {
    return null;
  }

  // Extract any padding from the passed style to apply it to the outer container
  const flatStyle = StyleSheet.flatten(style);
  const {
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
    paddingBottom = 0,
    padding = 0,
    ...restStyle
  } = flatStyle || {};

  // Apply padding to outer container, not the checkbox itself
  const outerContainerStyle = {
    paddingLeft: paddingLeft || padding,
    paddingRight: paddingRight || padding,
    paddingTop: paddingTop || padding,
    paddingBottom: paddingBottom || padding,
  };

  const boxStyle = [
    styles.container,
    {
      width: effectiveSize,
      height: effectiveSize,
      borderWidth: effectiveBorderWidth,
      borderRadius: boxType === 'circle' ? effectiveSize / 2 : 4,
      opacity: disabled ? 0.5 : 1,
    },
    {
      borderColor: borderColor,
      backgroundColor: backgroundColor,
    },
    restStyle, // Apply style without padding
  ];

  return (
    <View style={outerContainerStyle}>
      <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={0.7}>
        <Animated.View style={boxStyle}>
          {isSelected && (
            <Animated.Text
              style={[
                styles.checkmark,
                {
                  color: effectiveCheckColor,
                  opacity: animatedValue,
                  fontSize: effectiveSize * 0.7, // Scale checkmark with checkbox size
                },
              ]}>
              ✓
            </Animated.Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#aaaaaa',
    backgroundColor: 'transparent',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default CustomCheckBox; 