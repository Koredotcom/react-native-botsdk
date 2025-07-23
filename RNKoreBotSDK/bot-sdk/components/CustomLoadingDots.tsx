import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

interface LoadingDotsProps {
  animation?: 'typing' | 'pulse' | 'bounce';
  color?: string;
  size?: number;
  spacing?: number;
  delay?: number;
  numberOfDots?: number;
}

const CustomLoadingDots: React.FC<LoadingDotsProps> = ({
  animation = 'typing',
  color = '#000000',
  size = 6,
  spacing = 8,
  delay = 150,
  numberOfDots = 3,
}) => {
  const animatedValues = useRef(
    Array.from({length: numberOfDots}, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const createTypingAnimation = () => {
      const animations = animatedValues.map((animatedValue, index) =>
        Animated.sequence([
          Animated.delay(index * delay),
          Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.delay((numberOfDots - 1 - index) * delay),
            ]),
          ),
        ]),
      );

      Animated.parallel(animations).start();
    };

    const createPulseAnimation = () => {
      const animations = animatedValues.map((animatedValue, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * delay),
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ),
      );

      Animated.stagger(delay, animations).start();
    };

    const createBounceAnimation = () => {
      const animations = animatedValues.map((animatedValue, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * delay),
            Animated.spring(animatedValue, {
              toValue: 1,
              friction: 3,
              tension: 100,
              useNativeDriver: true,
            }),
            Animated.spring(animatedValue, {
              toValue: 0,
              friction: 3,
              tension: 100,
              useNativeDriver: true,
            }),
          ]),
        ),
      );

      Animated.stagger(delay, animations).start();
    };

    // Reset all animations
    animatedValues.forEach(value => value.setValue(0));

    switch (animation) {
      case 'typing':
        createTypingAnimation();
        break;
      case 'pulse':
        createPulseAnimation();
        break;
      case 'bounce':
        createBounceAnimation();
        break;
      default:
        createTypingAnimation();
    }

    return () => {
      animatedValues.forEach(value => value.stopAnimation());
    };
  }, [animatedValues, animation, delay, numberOfDots]);

  const getDotStyle = (animatedValue: Animated.Value) => {
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1.2],
    });

    return {
      opacity,
      transform: [{scale}],
    };
  };

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: color,
              width: size,
              height: size,
              borderRadius: size / 2,
              marginHorizontal: spacing / 2,
            },
            getDotStyle(animatedValue),
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: '#000000',
  },
});

export default CustomLoadingDots; 