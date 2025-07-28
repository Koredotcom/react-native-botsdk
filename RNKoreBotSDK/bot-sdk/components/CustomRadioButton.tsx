import * as React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export interface RadioButtonProps {
  id: string;
  label?: string;
  value?: string;
  selected?: boolean;
  onPress?: (id: string) => void;
  size?: number;
  borderSize?: number;
  color?: string;
  borderColor?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export interface RadioGroupProps {
  radioButtons: RadioButtonProps[];
  onPress?: (selectedId: string) => void;
  containerStyle?: ViewStyle;
  color?: string; // Global color for selected state for all radio buttons
  borderColor?: string; // Global border color for unselected state for all radio buttons
}

export const CustomRadioButton: React.FC<RadioButtonProps> = ({
  id,
  label,
  value,
  selected = false,
  onPress,
  size = 20,
  borderSize = 2,
  color = '#007AFF',
  borderColor = '#CCCCCC',
  labelStyle,
  containerStyle,
}) => {
  console.log(`CustomRadioButton ${id} rendered with selected: ${selected}`);
  
  const handlePress = () => {
    console.log(`RadioButton ${id} pressed, current selected: ${selected}`);
    if (onPress) {
      onPress(id);
    }
  };

  const outerCircleStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: selected ? 3 : borderSize,
    borderColor: selected ? color : borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: selected ? '#E3F2FD' : 'white',
  };

  const innerCircleStyle: ViewStyle = {
    width: size * 0.6,
    height: size * 0.6,
    borderRadius: (size * 0.6) / 2,
    backgroundColor: selected ? color : 'transparent',
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={outerCircleStyle}>
        <View style={innerCircleStyle} />
      </View>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export const CustomRadioGroup: React.FC<RadioGroupProps> = ({
  radioButtons,
  onPress,
  containerStyle,
  color = '#007AFF', // Default blue for selected state
  borderColor = '#CCCCCC', // Default gray for unselected border
}) => {
  const handlePress = (selectedId: string) => {
    console.log(`RadioGroup received press for: ${selectedId}`);
    if (onPress) {
      onPress(selectedId);
    }
  };

  return (
    <View style={[styles.groupContainer, containerStyle]}>
      {radioButtons.map((button, index) => {
        const radioProps: RadioButtonProps = {
          id: button.id,
          label: button.label,
          value: button.value,
          selected: button.selected,
          size: button.size,
          borderSize: button.borderSize,
          // Individual button colors override group colors
          color: button.color || color,
          borderColor: button.borderColor || borderColor,
          labelStyle: button.labelStyle,
          containerStyle: button.containerStyle,
          onPress: handlePress,
        };
        
        return React.createElement(CustomRadioButton, {
          ...radioProps,
          key: `radio-${index}-${button.id}`,
        });
      })}
    </View>
  );
};

// For compatibility with existing imports
export const RadioButton = CustomRadioButton;
export default CustomRadioGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 4,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  groupContainer: {
    backgroundColor: 'transparent',
  },
}); 