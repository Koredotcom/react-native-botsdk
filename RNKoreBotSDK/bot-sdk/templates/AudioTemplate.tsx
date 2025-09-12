import React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {Dimensions, StyleSheet, View} from 'react-native';
const windowWidth = Dimensions.get('window').width;

import AudioPlayer from '../components/AudioPlayer';
import BotText from './BotText';
import {getBubbleTheme} from '../theme/themeHelper';
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
    const bubbleTheme = getBubbleTheme(this.props.theme)
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
          <View style={[styles.container,{borderColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR,borderWidth: 1, borderRadius: 5}]}>
            <AudioPlayer
              audioUrl={url}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: windowWidth * 0.80 ,
  },
});
