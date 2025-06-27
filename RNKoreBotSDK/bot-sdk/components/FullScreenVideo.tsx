import React, {Component, createRef} from 'react';
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  BackHandler,
  StatusBar,
} from 'react-native';
import VideoPlayer from './MoVideoPlayer';

interface FullScreenVideoProps {
  onClose: (event: GestureResponderEvent | undefined) => void;
  getVideoRef?: any;
  duration?: any;
}

export interface MyFunctionComponentRef {
  onCloseScreen: () => void;
  onOpenScreen: (val: any) => void;
  onGetVideoDuration: () => any;
  onSetVideoDuration: (val: any) => void;
  getSource: () => string;
  setVideoState: (state: any) => void;
}

class FullScreenVideo extends Component<FullScreenVideoProps> {
  private myRef = createRef<MyFunctionComponentRef>();

  private backAction = () => {
    if (this.myRef?.current?.onCloseScreen) {
      this.myRef?.current?.onCloseScreen?.();
    }
    this.props.onClose(undefined);

    return false;
  };
  backHandler: any;

  componentDidMount(): void {
    this.props?.getVideoRef?.setVideoState?.(true);
    setTimeout(() => {
      StatusBar.setHidden(false);
      this.props?.getVideoRef?.setVideoState?.(true);
      if (this.myRef?.current?.onOpenScreen) {
        //this.myRef?.current?.setVideoState?.(false);
        this.myRef?.current?.onOpenScreen?.(this.props.duration);
      }
    }, 500);

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  componentWillUnmount() {
    this.backHandler?.remove?.();
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <VideoPlayer
          ref={this.myRef}
          source={this.props?.getVideoRef?.getSource()}
          disableBack={true}
          autoPlay={true}
          fullScreen={true}
          // showFullScreenButton={false}
          onBackPress={() => {
            if (this.myRef?.current?.onCloseScreen) {
              this.myRef?.current?.onCloseScreen?.();
            }
            this.props.onClose(undefined);
          }}
          duration={this.props.duration}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    // margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FullScreenVideo;
