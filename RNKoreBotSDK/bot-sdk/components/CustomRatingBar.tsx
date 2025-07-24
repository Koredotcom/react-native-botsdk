import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface RatingElement {
  full: React.ReactNode;
  half: React.ReactNode;
  empty: React.ReactNode;
}

interface CustomRatingBarProps {
  initialRating?: number;
  direction?: 'horizontal' | 'vertical';
  allowHalfRating?: boolean;
  itemCount?: number;
  itemPadding?: number;
  itemBuilder?: (index: number) => React.ReactNode;
  ratingElement?: RatingElement;
  onRatingUpdate?: (rating: number) => void;
}

export const CustomRatingBar: React.FC<CustomRatingBarProps> = ({
  initialRating = 0,
  direction = 'horizontal',
  allowHalfRating = false,
  itemCount = 5,
  itemPadding = 4,
  itemBuilder,
  ratingElement,
  onRatingUpdate,
}) => {
  const [currentRating, setCurrentRating] = useState(initialRating);

  const handlePress = (index: number) => {
    const newRating = index + 1;
    setCurrentRating(newRating);
    onRatingUpdate?.(newRating);
  };

  const renderRatingItem = (index: number) => {
    if (itemBuilder) {
      // Custom item builder (for emojis)
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index)}
          style={[styles.itemContainer, { padding: itemPadding }]}
        >
          {itemBuilder(index)}
        </TouchableOpacity>
      );
    }

    if (ratingElement) {
      // Star rating elements
      const isSelected = index < currentRating;
      const isHalfSelected = allowHalfRating && index + 0.5 === currentRating;
      
      let element = ratingElement.empty;
      if (isSelected) {
        element = ratingElement.full;
      } else if (isHalfSelected) {
        element = ratingElement.half;
      }

      return (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index)}
          style={[styles.itemContainer, { padding: itemPadding }]}
        >
          {element}
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View 
      style={[
        styles.container,
        direction === 'vertical' ? styles.vertical : styles.horizontal
      ]}
    >
      {Array.from({ length: itemCount }, (_, index) => renderRatingItem(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomRatingBar; 