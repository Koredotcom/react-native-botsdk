import React, {Component} from 'react';
import {
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface CustomModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  useNativeDriver?: boolean;
  hideModalContentWhileAnimating?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CustomModalState {
  modalVisible: boolean;
  animatedValue: Animated.Value;
}

class CustomModal extends Component<CustomModalProps, CustomModalState> {
  private backHandler: any;

  constructor(props: CustomModalProps) {
    super(props);
    this.state = {
      modalVisible: false,
      animatedValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (this.props.isVisible) {
      this.showModal();
    }
  }

  componentDidUpdate(prevProps: CustomModalProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (this.props.isVisible) {
        this.showModal();
      } else {
        this.hideModal();
      }
    }
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  showModal = () => {
    this.setState({modalVisible: true}, () => {
      // Add back button handler for Android
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButton,
      );

      // Animate in
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: this.props.useNativeDriver !== false,
      }).start();
    });
  };

  hideModal = () => {
    // Remove back button handler
    if (this.backHandler) {
      this.backHandler.remove();
      this.backHandler = null;
    }

    // Animate out
    Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: this.props.useNativeDriver !== false,
    }).start(() => {
      this.setState({modalVisible: false});
    });
  };

  handleBackButton = (): boolean => {
    if (this.props.onBackButtonPress) {
      this.props.onBackButtonPress();
      return true; // Prevent default back button behavior
    }
    return false;
  };

  handleBackdropPress = () => {
    if (this.props.onBackdropPress) {
      this.props.onBackdropPress();
    }
  };

  render() {
    const {modalVisible, animatedValue} = this.state;
    const {animationType = 'fade', hideModalContentWhileAnimating} = this.props;

    if (!modalVisible) {
      return null;
    }

    // Animation styles based on type
    let animatedStyle: any = {};
    
    switch (animationType) {
      case 'slide':
        animatedStyle = {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [screenHeight, 0],
              }),
            },
          ],
        };
        break;
      case 'fade':
      default:
        animatedStyle = {
          opacity: animatedValue,
        };
        break;
    }

    // Backdrop animation
    const backdropStyle = {
      opacity: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    };

    return (
      <Modal
        transparent
        visible={modalVisible}
        animationType="none" // We handle animations ourselves
        onRequestClose={this.handleBackButton}>
        <View style={styles.container}>
          {/* Animated backdrop */}
          <Animated.View style={[styles.backdrop, backdropStyle]} />
          
          {/* Touchable backdrop for press detection */}
          <TouchableWithoutFeedback onPress={this.handleBackdropPress}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>

          {/* Modal content */}
          <Animated.View
            style={[
              styles.contentContainer,
              animatedStyle,
              this.props.style,
              hideModalContentWhileAnimating && {
                opacity: animatedValue,
              },
            ]}>
            {this.props.children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default CustomModal; 