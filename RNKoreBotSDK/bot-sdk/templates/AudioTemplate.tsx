import React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {Dimensions, StyleSheet, View} from 'react-native';
const windowWidth = Dimensions.get('window').width;

import AudioPlayer from '../components/AudioPlayer';
import BotText from './BotText';

interface AudioProps extends BaseViewProps {}

interface AudioState extends BaseViewState {
  isPlaying?: boolean;
  duration?: any;
  currentTime?: any;
}

export default class AudioTemplate extends BaseView<AudioProps, AudioState> {
  intervalId: number | undefined;
  constructor(props: AudioProps) {
    super(props);
    this.state = {isPlaying: false};
  }

  render() {
    const url = this.props.payload?.audioUrl;
    console.log('this.props.payload --->:', this.props.payload);
    console.log('this.props.payload?.audioUrl url--->:', url);

    const isDisable = this.isViewDisable();
    return (
      <View pointerEvents={isDisable ? 'none' : 'auto'}>
        {this.props.payload?.text && (
          <View style={{marginBottom: 10}}>
            <BotText
              text={this.props.payload?.text?.trim()}
              isFilterApply={true}
              isLastMsz={!this.isViewDisable()}
              theme={this.props.theme}
            />
          </View>
        )}
        {url && (
          <View style={styles.container}>
            <AudioPlayer
              url={url}
              onMenuClick={() => {
                console.log('=================>>> OnMenu clicked ');
              }}
              isStopPlayer={isDisable}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efeffc',
    borderRadius: 5,
    flexDirection: 'row',
    width: (windowWidth / 4) * 3.15,
  },
});
