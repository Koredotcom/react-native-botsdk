import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { normalize } from '../utils/helpers';

interface PinInputGroupProps {
    pinLength: number;
    value: string[];
    onChange: (newValue: string[]) => void;
    themeColors: {
      active: string;
      inactive: string;
    };
  }

export default function PinInputGroup({
  pinLength,
  value,
  onChange,
  themeColors,
}: PinInputGroupProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputsRef = useRef([]);

  const handleChange = (text: any, index: number) => {
    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    if (text.length > 0 && index < pinLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: num) => {
    if (e.nativeEvent.key === 'Backspace' && value[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: pinLength }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputsRef.current[index] = ref)}
          style={[
            styles.input,
            {
              borderColor:
                focusedIndex === index
                  ? themeColors.active
                  : themeColors.inactive,
            },
          ]}
          placeholder="0"
          placeholderTextColor="#e4e5eb"
          keyboardType="numeric"
          maxLength={1}
          value={value[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
  },
  input: {
    height: 40,
    width: 40,
    textAlign: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    marginEnd: normalize(10),
  },
});