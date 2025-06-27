import React, {Component} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

interface FadeInToTopProps {
  duration?: number;
  children?: any;
}

interface FadeInToTopState {
  animation: Animated.CompositeAnimation | null;
}

class FadeInToTop extends Component<FadeInToTopProps, FadeInToTopState> {
  fadeAnim = new Animated.Value(0);
  translateAnim = new Animated.Value(200); // Initial position is off-screen

  componentDidMount() {
    const {duration = 500} = this.props;

    const animation = Animated.parallel([
      Animated.timing(this.translateAnim, {
        toValue: 0, // Adjust this value to control how far the element moves up
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]);

    this.setState({animation}, () => {
      if (this.state.animation) {
        this.state.animation.start();
      }
    });
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: this.fadeAnim,
            transform: [{translateY: this.translateAnim}],
          },
        ]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // //top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
});

export default FadeInToTop;
