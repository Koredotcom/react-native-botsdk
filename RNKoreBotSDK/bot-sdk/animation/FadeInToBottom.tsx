import React, {Component} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

interface FadeInToBottomProps {
  duration?: number;
  children?: any;
  getRef?: any;
}

interface FadeInToBottomState {
  animation: Animated.CompositeAnimation | null;
  isApplyAnim?: boolean;
}

class FadeInToBottom extends Component<
  FadeInToBottomProps,
  FadeInToBottomState
> {
  fadeAnim = new Animated.Value(0);
  translateAnim = new Animated.Value(100); // Initial position is off-screen
  animation: any;

  constructor(props: FadeInToBottomProps) {
    super(props);
    this.state = {
      animation: null,
      isApplyAnim: false,
    };
  }

  componentDidMount() {
    if (this.props.getRef) {
      this.props.getRef(this);
    }

    const {duration = 500} = this.props;

    this.animation = Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(this.translateAnim, {
        toValue: 0, // Adjust this value to control how far the element moves down
        duration,
        useNativeDriver: true,
      }),
    ]);
    // if (!this.props.isInit) {
    //   this.setState({animation: this.animation}, () => {
    //     if (this.state.animation) {
    //       this.state.animation.start();
    //     }
    //   });
    // }
  }

  startAnimation = () => {
    this.setState({animation: this.animation, isApplyAnim: true}, () => {
      if (this.state.animation) {
        this.state.animation.start();
      }
    });
  };

  render() {
    if (!this.state.isApplyAnim) {
      return this.props.children;
    }
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
    //flex: 1,
    // position: 'absolute',
    //bottom: 0,
    // left: 0,
    // right: 0,
    // top: 0,
  },
});

export default FadeInToBottom;
