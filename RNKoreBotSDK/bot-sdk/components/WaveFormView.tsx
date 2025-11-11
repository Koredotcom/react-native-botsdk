import React, {Component} from 'react';
import {Text, View, Animated, Easing, StyleSheet} from 'react-native';

interface WaveProps {
  barColor?: string;
}
interface WaveState {}

const dotAnimations = Array.from({length: 4}).map(() => new Animated.Value(1));
const keyframes1 = [0.0, 1, 0.8, 0.5, 0.0, 0.5, 0.8, 1, 0.0];
const keyframes3 = [0.0, 1, 0.5, 0.2, 0.0, 0.2, 0.5, 0.8, 1, 0.0];

const keyFramesList = [keyframes3, keyframes1];

const AnimatedSoundBars = ({barColor = 'white'}) => {
  const loopAnimation = (node: any, index: any) => {
    const loop = Animated.sequence(
      keyFramesList[index % keyFramesList.length].map(toValue => {
        // console.log('toValue  --->:', toValue);
        return Animated.timing(node, {
          toValue,
          easing: Easing.ease,
          useNativeDriver: true,
        });
      }),
    );

    return loop;
  };

  const loadAnimation = (nodes: any) =>
    Animated.loop(Animated.stagger(200, nodes.map(loopAnimation)))?.start?.();

  React.useEffect(() => {
    setTimeout(() => {
      loadAnimation(dotAnimations);
    }, 1);
  }, []);

  return (
    <View style={styles.row}>
      {dotAnimations.map((animation, index) => {
        return (
          <Animated.View
            key={`${index}`}
            style={[
              styles.bar,
              {backgroundColor: barColor},
              {
                transform: [
                  {
                    scale: animation,
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default class WaveFormView extends Component<WaveProps, WaveState> {
  render() {
    return <AnimatedSoundBars barColor={this.props.barColor || 'white'} />;
  }
}

const styles = StyleSheet.create({
  row: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bar: {
    height: 17,
    width: 3,
    borderRadius: 20,
    marginHorizontal: 1.5,
  },
});
