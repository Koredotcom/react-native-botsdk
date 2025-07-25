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

  const effectiveCheckColor = checkBoxColor || onCheckColor;
  const effectiveTintColor = checkBoxColor || tintColor;

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [effectiveTintColor, onTintColor],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', onFillColor],
  });

  if (hideBox) {
    return null;
  }

  const containerSize = 24;

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
      width: containerSize,
      height: containerSize,
      borderWidth: lineWidth,
      borderRadius: boxType === 'circle' ? containerSize / 2 : 4,
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