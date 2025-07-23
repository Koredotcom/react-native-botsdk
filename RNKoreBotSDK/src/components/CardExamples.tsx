import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';

interface CardProps {
  title: string;
  content: string;
  onPress?: () => void;
}

interface EnhancedCardProps extends CardProps {
  image?: ImageSourcePropType;
}

interface Shadow2CardProps {
  title: string;
  content: string;
  children?: React.ReactNode;
}

// Option 1: Built-in React Native 0.77+ Card with box-shadow
export const NativeCard: React.FC<CardProps> = ({title, content, onPress}) => {
  return (
    <TouchableOpacity style={styles.nativeCard} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardContent}>{content}</Text>
    </TouchableOpacity>
  );
};

// Option 2: Enhanced card with multiple shadows
export const EnhancedCard: React.FC<EnhancedCardProps> = ({title, content, image, onPress}) => {
  return (
    <TouchableOpacity style={styles.enhancedCard} onPress={onPress}>
      {image && <Image source={image} style={styles.cardImage} />}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Option 3: react-native-shadow-2 Card (uncomment after installing react-native-shadow-2)
/*
export const Shadow2Card: React.FC<Shadow2CardProps> = ({title, content, children}) => {
  return (
    <Shadow
      distance={5}
      startColor={'#00000010'}
      containerViewStyle={{marginVertical: 10}}
      radius={8}>
      <View style={styles.shadow2Card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content}</Text>
        {children}
      </View>
    </Shadow>
  );
};
*/

// Option 4: Elevated card with gradient-like effect
export const ElevatedCard: React.FC<CardProps> = ({title, content, onPress}) => {
  return (
    <TouchableOpacity style={styles.elevatedCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardContent}>{content}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Native Card with React Native 0.77+ box-shadow
  nativeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    // Multiple box shadows now supported in RN 0.77+!
    boxShadow: `
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24),
      0 4px 8px rgba(0, 0, 0, 0.08)
    `,
  },

  // Enhanced card with elevation and glow
  enhancedCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    boxShadow: `
      0 2px 8px rgba(0, 0, 0, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 16px 40px rgba(0, 0, 0, 0.1)
    `,
  },

  // react-native-shadow-2 card
  shadow2Card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },

  // Elevated card with modern styling
  elevatedCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 8,
    overflow: 'hidden',
    boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.07),
      0 10px 15px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(255, 255, 255, 0.05)
    `,
  },

  cardHeader: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  cardBody: {
    padding: 16,
  },

  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  cardContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default {
  NativeCard,
  EnhancedCard,
  ElevatedCard,
}; 