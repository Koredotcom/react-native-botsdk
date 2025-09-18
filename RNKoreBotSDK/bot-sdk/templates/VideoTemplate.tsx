import * as React from 'react';
import { createRef } from 'react';
import BaseView, { BaseViewProps, BaseViewState } from './BaseView';
import {
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import FullScreenVideo, {
  MyFunctionComponentRef,
} from '../components/FullScreenVideo';

import { normalize } from '../utils/helpers';
import BotText from './BotText';
import { LazyOrientation } from '../components/LazyOrientation';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';

const WIDTH = Dimensions.get('window').width;

interface VideoProps extends BaseViewProps {}

interface VideoState extends BaseViewState {
  modalVisible?: boolean;
  myVideoRef: any;
  duration: number;
  url?: string;
  currentTime: number;
}

export default class VideoTemplate extends BaseView<VideoProps, VideoState> {
  private videoRef = createRef<Video>();
  private orientationRef = createRef<LazyOrientation>();
  dur?: number;

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      modalVisible: false,
      myVideoRef: null,
      duration: 0,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      currentTime: 0,
    };
  }

  componentDidUpdate(
    _prevProps: Readonly<VideoProps>,
    prevState: Readonly<VideoState>,
    _snapshot?: any,
  ): void {
    if (prevState.modalVisible !== this.state.modalVisible) {
      this.orientationRef.current?.lockToPortrait();
      StatusBar.setHidden(false);
    }

    if (this.isViewDisable() && this.state.url) {
      this.setState({ url: undefined });
      this.videoRef?.current?.seek?.(0);
    }
  }

  private onLoad = (data: OnLoadData) => {
    this.setState({ duration: data.duration });
    this.dur = data.duration;
  };

  private onProgress = (data: OnProgressData) => {
    this.setState({ currentTime: data.currentTime });
  };

  private formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  private renderPlayerView = () => {
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        <Video
          ref={this.videoRef}
          source={{ uri: this.state.url! }}
          style={styles.video}
          controls={true}
          resizeMode="contain"
          onLoad={this.onLoad}
          onProgress={this.onProgress}
        />

        {/* Time display */}
        <Text style={styles.timeText}>
          {this.formatTime(this.state.currentTime)} /{' '}
          {this.formatTime(this.state.duration)}
        </Text>

        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}>
          <FullScreenVideo
            onClose={() => {
              this.setState({ modalVisible: false });
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
        <LazyOrientation ref={this.orientationRef} autoLoad={true} />
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
  video: {
    width: (WIDTH / 4) * 3.2,
    height: normalize(200),
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: 'black',
  },
  timeText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
});
