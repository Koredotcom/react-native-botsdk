import * as React from 'react';
import {createRef} from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import FullScreenVideo, {
  MyFunctionComponentRef,
} from '../components/FullScreenVideo';

// Conditional import for orientation locker
let Orientation: any = null;
try {
  Orientation = require('react-native-orientation-locker').default;
} catch (error) {
  console.warn('react-native-orientation-locker not available, orientation features will be disabled');
}

import {normalize} from '../utils/helpers';
import MoVideoPlayer from '../components/MoVideoPlayer';
import BotText from './BotText';

const WIDTH = Dimensions.get('window').width;

interface VideoProps extends BaseViewProps {}

interface VideoState extends BaseViewState {
  modalVisible?: boolean;
  myVideoRef: any;
  duration: any;
  url?: string | undefined;
}

export default class VideoTemplate extends BaseView<VideoProps, VideoState> {
  private videoRef = createRef<MyFunctionComponentRef>();
  dur?: any;
  constructor(props: VideoProps) {
    super(props);
    this.state = {
      modalVisible: false,
      myVideoRef: null,
      duration: 0,
      url: this.props?.payload?.videoUrl,
    };
  }

  componentDidUpdate(
    _prevProps: Readonly<VideoProps>,
    prevState: Readonly<VideoState>,
    _snapshot?: any,
  ): void {
    if (prevState.modalVisible !== this.state.modalVisible) {
      if (Orientation && Orientation.lockToPortrait) {
        try {
          Orientation.lockToPortrait();
        } catch (error) {
          console.warn('Failed to lock orientation:', error);
        }
      }
      StatusBar.setHidden(false);
    }

    if (this.isViewDisable() && this.state.url) {
      this.setState({
        url: undefined,
      });
      this.videoRef?.current?.setVideoState?.(true);
    }
  }
  private renderPlayerView = () => {
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'} style={{}}>
        <MoVideoPlayer
          ref={(ref: any) => {
            if (!this.state.myVideoRef) {
              this.videoRef = ref;
              this.setState({
                myVideoRef: ref,
              });
            }
          }}
          style={styles.player}
          source={{
            uri: this.state.url,
          }}
          //poster="https://www.carage.net/media/halfhd/carage_fahrzeuge_square_8.jpg"
          // title="React Native MO-VIDEO-PLAYER"
          autoPlay={false}
          playInBackground={false}
          //  source={{uri: this.state.url}}
          isFromNormalScreen={true}
          getCurrentVideoDuration={(dur: any) => {
            this.dur = dur;
          }}
          isViewDisable={this.isViewDisable()}
          showSettingButton={false}
          showSeeking10SecondsButton={true}
          showCoverButton={true}
          showFullScreenButton={true}
          onFullScreen={() => {
            this.state.myVideoRef?.setVideoState?.(true);
            setTimeout(() => {
              // this.state.myVideoRef?.setVideoState?.(true);
              this.setState({
                modalVisible: true,
                duration: this.dur,
              });
            }, 100);
          }}
        />

        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          onRequestClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}>
          <FullScreenVideo
            onClose={() => {
              this.setState({
                modalVisible: false,
              });
            }}
            getVideoRef={this.state.myVideoRef}
            duration={this.state.duration}
          />
        </Modal>
      </View>
    );
  };

  render() {
    return (
      <View>
        {this.props.payload && (
          <View>
            {this.props.payload?.text && (
              <BotText
                text={this.props.payload?.text?.trim()}
                isFilterApply={true}
                isLastMsz={!this.isViewDisable()}
                theme={this.props.theme}
              />
            )}
            {this.renderPlayerView()}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  player: {
    width: (WIDTH / 4) * 3.2,
    height: normalize(200),
    marginTop: Platform.OS == 'ios' ? 30 : 0,
    backgroundColor: 'green',
  },
});
