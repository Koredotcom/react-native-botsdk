import * as React from 'react';
import { createRef } from 'react';
import BaseView, { BaseViewProps, BaseViewState } from './BaseView';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { normalize } from '../utils/helpers';
import BotText from './BotText';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';

const WIDTH = Dimensions.get('window').width;

interface VideoProps extends BaseViewProps {}

interface VideoState extends BaseViewState {
  myVideoRef: any;
  duration: number;
  url?: string;
  currentTime: number;
}

export default class VideoTemplate extends BaseView<VideoProps, VideoState> {
  private videoRef = createRef<Video>();
  dur?: number;

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      myVideoRef: null,
      duration: 0,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      currentTime: 0,
    };
  }

  componentDidUpdate(
    _prevProps: Readonly<VideoProps>,
    _snapshot?: any,
  ): void {
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
