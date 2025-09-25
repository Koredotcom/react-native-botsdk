import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {Composer} from './Composer';
import Send from './Send';
import Color from '../../theme/Color';
import {normalize} from '../../utils/helpers';
import {ThemeContext} from '../../theme/ThemeContext';
import {IThemeType} from '../../theme/IThemeType';
import {SvgIcon} from '../../utils/SvgIcon';
import FadeInToBottom from '../../animation/FadeInToBottom';
import FadeInToTop from '../../animation/FadeInToTop';
import {MIN_TOOL_BAR_HEIGHT} from '../../constants/Constant';
import WaveFormView from '../../components/WaveFormView';
import VoiceHelper from '../../utils/VoiceRecorder';
type SpeechErrorEvent = any;
import {isIOS} from '../../utils/PlatformCheck';

interface InputToolbarProps {
  renderAccessory?: ((props: any) => any) | null;
  renderActions?: ((props: any) => any) | null;
  renderSend?: ((props: any) => any) | null;
  renderComposer?: ((props: any) => any) | null;
  onPressActionButton?: ((props: any) => any) | null;
  containerStyle?: any;
  primaryStyle?: any;
  accessoryStyle?: any;
  renderSuggestionsView?: ((props: any) => any) | null;
  renderQuickRepliesView?: ((props: any) => any) | null;
  renderSpeechToText?: ((props: any) => any) | null;
  onMenuItemClick?: any;
  onAttachedItemClick?: any;
  renderMediaView?: ((props: any) => any) | null;
  isMediaAddedToSend?: boolean;
  isMediaLoading?: boolean;
  onSTTValue?: any;
  onSendSTTClick?: any;
}

interface InputToolbarStates {
  isSTTViewShow?: boolean;
  showMenuPopover?: boolean;
  showAttachedPopover?: boolean;
  isRecordingstart?: boolean;
  recordState?: string;
  STT_value?: any;
}

const RECORD_STATE = {
  onSpeechStart: 'onSpeechStart',
  onSpeechRecognized: 'onSpeechRecognized',
  onSpeechEnd: 'onSpeechEnd',
  onSpeechError: 'onSpeechError',
  onSpeechStop: 'onSpeechStop',
};

const styles = StyleSheet.create({
  handle_container: {
    alignItems: 'center',
    height: 26,
    justifyContent: 'center',
  },
  handle: {
    width: 64,
    height: 5.8,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0.45,
    borderColor: 'black',
    justifyContent: 'center',
  },
  pop_sub: {
    marginTop: 5,
    flexDirection: 'column',
    minWidth: normalize(80),
  },
  pop_main: {
    position: 'absolute',
    end: 0,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 5,
    paddingEnd: 10,
    paddingBottom: 5,
    marginEnd: 5,
    zIndex: 1,
  },
  dropdown_main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stt_title: {
    color: '#697586',
    fontSize: normalize(14),
    backgroundColor: Color.transparent,
    marginTop: 10,
    textAlign: 'left',
  },
  stt_mic_main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stt_sub2: {
    width: normalize(45),
    minHeight: normalize(45),
    borderRadius: 25,
    backgroundColor: Color.bot_blue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -28,
  },
  stt_sub: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stt_main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  send_container1: {
    backgroundColor: Color.bot_blue,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goTextStyle: {
    color: '#ffffff',
    fontSize: normalize(12),
    fontWeight: '500',
    fontStyle: 'normal',
    fontFamily: 'Inter',
  },
  send_container: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  send_main_container: {
    width: normalize(40),
    height: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    backgroundColor: Color.red,
  },
  container: {
    justifyContent: 'center',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessory: {
    height: 44,
  },
});

export default class InputToolbar extends React.Component<
  InputToolbarProps,
  InputToolbarStates
> {
  static contextType = ThemeContext;
  private voiceHelper: VoiceHelper;

  constructor(props: InputToolbarProps) {
    super(props);
    this.voiceHelper = new VoiceHelper(
      this.onSpeechStart,
      this.onSpeechRecognized,
      this.onSpeechEnd,
      this.onSpeechError,
      this.onSpeechResults,
      this.onSpeechPartialResults,
      this.onSpeechVolumeChanged,
    );
  }

  state = {
    position: 'absolute',
    isSTTViewShow: false,
    showMenuPopover: false,
    showAttachedPopover: false,
    isRecordingstart: false,
    recordState: RECORD_STATE.onSpeechStop,
    STT_value: '',
  };

  fadeInToBottomRef?: any;

  renderSuggestionsView() {
    if (this.props.renderSuggestionsView) {
      return this.props.renderSuggestionsView(this.props);
    }
    return null;
  }

  renderMediaView() {
    if (this.props.renderMediaView) {
      return this.props.renderMediaView(this.props);
    }
    return null;
  }

  private renderActions = () => {
    const {...props} = this.props;
    if (this.props.renderActions) {
      return this.props.renderActions(props);
    } else if (this.props.onPressActionButton) {
      return this.props.onPressActionButton(props);
    }
    return this._renderActions(props);
  };

  private _renderActions = (_props: any) => {
    const theme = this.context as IThemeType;

    return (
      <View style={{flexDirection: 'row'}}>
        {theme?.v3?.footer?.buttons?.menu?.show && (
          <TouchableOpacity
            onPress={() => {
              if (this.props.onMenuItemClick) {
                this.props.onMenuItemClick?.(
                  theme?.v3?.footer?.buttons?.menu?.actions,
                );
              }
            }}
            style={{padding: 5, marginLeft: 5}}>
            <SvgIcon
              name={'MenuIcon'}
              width={normalize(22)}
              height={normalize(22)}
              color={
                theme?.v3?.footer?.buttons?.menu?.icon_color ||
                theme?.v3?.footer?.icons_color ||
                '#697586'
              }
            />
          </TouchableOpacity>
        )}
        {theme?.v3?.footer?.buttons?.attachment?.show && (
          <TouchableOpacity
            onPress={() => {
              if (this.props.onAttachedItemClick) {
                this.props.onAttachedItemClick?.();
              }
            }}
            style={{padding: 5}}>
            <SvgIcon
              name={'AttachmentIcon'}
              width={normalize(22)}
              height={normalize(22)}
              color={
                theme?.v3?.footer?.buttons?.attachment?.icon_color ||
                theme?.v3?.footer?.icons_color ||
                '#697586'
              }
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return this._renderSend(this.props);
  }

  private _renderSend = (props: any) => {
    let disabled = true;
    let text = props?.text;
    if (text && text?.trim().length > 0) {
      disabled = false;
    }
    if (this.props?.isMediaAddedToSend) {
      disabled = false;
      if (this.state.isSTTViewShow) {
        this.setState(
          {
            isRecordingstart: false,
            isSTTViewShow: false,
            recordState: RECORD_STATE.onSpeechStop,
          },
          () => {
            this.stopRecognizing();
            this.fadeInToBottomRef?.startAnimation?.();
          },
        );
      }
    }
    const theme = this.context as IThemeType;
    const height = normalize(36);
    return (
      <Send {...props}>
        {disabled ? (
          <View
            pointerEvents={this.props.isMediaLoading ? 'none' : 'auto'}
            style={[styles.send_container]}>
            <TouchableOpacity
              onPress={() => {
                this.handleVoiceTextSwitch();
              }}>
              <SvgIcon
                name={this.state.isSTTViewShow ? 'KeyboardIcon' : 'MicIcon'}
                width={normalize(22)}
                height={normalize(22)}
                color={
                  theme?.v3?.footer?.buttons?.attachment?.icon_color ||
                  theme?.v3?.footer?.icons_color ||
                  '#697586'
                }
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            pointerEvents={disabled ? 'none' : 'auto'}
            style={[
              styles.send_container1,
              {
                backgroundColor: disabled
                  ? 'grey'
                  : theme?.v3?.body?.user_message?.bg_color
                  ? theme?.v3?.body?.user_message?.bg_color
                  : '#0D6EFD',
                width: normalize(height),
                height: normalize(height),
              },
            ]}>
            <SvgIcon
              name={'SendIcon'}
              width={normalize(16)}
              height={normalize(16)}
              color={
                theme?.v3?.body?.user_message?.color
                  ? theme?.v3?.body?.user_message?.color
                  : Color.white
              }
            />
          </View>
        )}
      </Send>
    );
  };

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }
    const theme = this.context as IThemeType;
    return (
      <View
        style={{
          flex: 1,
          marginTop: normalize(17),
          marginBottom: normalize(17),
        }}>
        <FadeInToBottom
          getRef={(ref: any) => {
            this.fadeInToBottomRef = ref;
          }}>
          <Composer theme={theme} {...this.props} />
        </FadeInToBottom>
      </View>
    );
  }

  onSpeechStart = () => {
    this.setState({
      isRecordingstart: true,
      recordState: RECORD_STATE.onSpeechStart,
    });
  };

  onSpeechRecognized = () => {
    this.setState({recordState: RECORD_STATE.onSpeechRecognized});
  };

  onSpeechEnd = () => {
    this.setState({
      isRecordingstart: false,
      recordState:
        this.state.STT_value?.length > 0
          ? RECORD_STATE.onSpeechEnd
          : RECORD_STATE.onSpeechStop,
    });
  };

  onSpeechError = async (e: SpeechErrorEvent) => {
    this.setState({
      isRecordingstart: false,
      recordState:
        this.state.STT_value?.length > 0
          ? RECORD_STATE.onSpeechEnd
          : RECORD_STATE.onSpeechStop,
    });
    console.log('onSpeechError --->:', e?.error);
    
    try {
      await this.voiceHelper.resetVoiceState();
    } catch (resetError) {
      console.warn('Failed to reset voice state after error:', String(resetError));
    }
  };

  onSpeechResults = (e: any) => {
    if (isIOS) {
      this.onSpeechResultsIos(e);
    } else {
      if (e?.value?.length > 0) {
        this.props?.onSTTValue?.(e.value[0]);
      }
      this.setState({
        isRecordingstart: false,
        recordState: RECORD_STATE.onSpeechStop,
        STT_value: e.value?.[0],
      });
      this.stopRecognizing();
    }
  };

  onSpeechResultsIos = (e: any) => {
    this.setState({
      STT_value: e.value?.[0],
    });
  };

  onSpeechPartialResults = (e: any) => {
    this.voiceHelper.resetCounter();
    if (e?.value?.length > 0) {
      this.props?.onSTTValue?.(e.value[0] + ' ...');
    }
  };

  onSpeechVolumeChanged = (_e: any) => {
    // this.setState({ pitch: e.value });
  };

  handleVoiceTextSwitch = () => {
    const newSTTViewState = !this.state.isSTTViewShow;
    
    this.setState(
      {
        isSTTViewShow: newSTTViewState,
        recordState: RECORD_STATE.onSpeechStop,
        isRecordingstart: false,
      },
      () => {
        if (!this.state.isSTTViewShow) {
          this.stopRecognizing();
          if (this.props.onSendSTTClick) {
            this.props.onSendSTTClick(true);
          }
        } else {
          this.voiceHelper.resetVoiceState().catch(() => {
          });
        }
        
        setTimeout(() => {
          this.fadeInToBottomRef?.startAnimation?.();
        }, 50);
      },
    );
  };

  startRecognizing = async () => {
    try {
      await this.voiceHelper.resetVoiceState();
      setTimeout(() => {
        this.voiceHelper.startRecognizing();
      }, 100);
    } catch (error) {
      console.warn('Failed to reset voice state before start:', String(error));
      this.voiceHelper.startRecognizing();
    }
  };

  stopRecognizing = () => {
    this.voiceHelper.stopRecognizing();
  };

  cancelRecognizing = () => {
    this.voiceHelper.cancelRecognizing();
  };

  destroyRecognizer = () => {
    this.voiceHelper.destroyRecognizer();
  };

  handleVoiceToTextSwitch = () => {
    this.setState(
      {
        isSTTViewShow: false,
        recordState: RECORD_STATE.onSpeechStop,
        isRecordingstart: false,
        STT_value: '',
      },
      () => {
        this.stopRecognizing();
        
        if (this.props.onSendSTTClick) {
          this.props.onSendSTTClick(true);
        }
        
        setTimeout(() => {
          this.fadeInToBottomRef?.startAnimation?.();
        }, 50);
      },
    );
  };

  renderSTTView() {
    return (
      <View style={{flex: 1}}>
        <FadeInToTop>
          <View style={styles.stt_sub}>
            <View style={styles.stt_sub2}>
              {this.state.isRecordingstart ? (
                <WaveFormView />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.recordState === RECORD_STATE.onSpeechEnd) {
                      if (this.props.onSendSTTClick) {
                        this.props.onSendSTTClick(false);

                        this.setState(
                          {
                            isSTTViewShow: false,
                            recordState: RECORD_STATE.onSpeechStop,
                            STT_value: '',
                          },
                          () => {
                            if (!this.state.isSTTViewShow) {
                              if (this.props.onSendSTTClick) {
                                this.props.onSendSTTClick(true);
                              }
                            }
                            this.fadeInToBottomRef?.startAnimation?.();
                          },
                        );
                      }
                    } else {
                      this.voiceHelper.startRecognizing();
                    }

                    // console.log('---------------- MicIcon clicked -----------');
                  }}
                  style={styles.stt_mic_main}>
                  <SvgIcon
                    name={
                      this.state.recordState === RECORD_STATE.onSpeechEnd
                        ? 'SendIcon'
                        : 'MicIcon'
                    }
                    width={normalize(22)}
                    height={normalize(22)}
                    color={Color.white}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{}}>
              <Text style={styles.stt_title}>{this.getRecordTitle()}</Text>
              {this.state.recordState !== RECORD_STATE.onSpeechStop && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Color.transparent,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                  }}
                  onPress={() => {
                    this.setState(
                      {
                        isSTTViewShow: false,
                        recordState: RECORD_STATE.onSpeechStop,
                      },
                      () => {
                        if (!this.state.isSTTViewShow) {
                          if (this.props.onSendSTTClick) {
                            this.props.onSendSTTClick(true);
                          }
                        }
                        this.fadeInToBottomRef?.startAnimation?.();
                      },
                    );
                  }}>
                  <Text
                    style={{
                      color: '#4B4EDE',
                    }}>
                    {'Cancel'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </FadeInToTop>
      </View>
    );
  }
  getRecordTitle(): string | null {
    switch (this.state.recordState) {
      case RECORD_STATE.onSpeechEnd:
        return 'Tap to send';
      case RECORD_STATE.onSpeechStart:
      case RECORD_STATE.onSpeechRecognized:
        return 'Listening... Tap to end';
      case RECORD_STATE.onSpeechStop:
        return 'Tap microphone to speak';
    }

    return null;
  }

  renderQuickRepliesView(theme: any) {
    if (this.props.renderQuickRepliesView) {
      return this.props.renderQuickRepliesView({...this.props, theme});
    }

    return null;
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  renderSpeechToText() {
    if (this.props.renderSpeechToText) {
      return this.props.renderSpeechToText(this.props);
    }

    return null;
  }

  private isShowActions = () => {
    if (this.state.recordState === RECORD_STATE.onSpeechRecognized) {
      return false;
    }
    if (this.state.recordState === RECORD_STATE.onSpeechStart) {
      return false;
    }
    if (this.state.recordState === RECORD_STATE.onSpeechEnd) {
      return false;
    }
    return true;
  };

  render() {
    const theme = this.context as IThemeType;
    const minHeight: number =
      this.state.isSTTViewShow &&
      this.state.recordState === RECORD_STATE.onSpeechStop
        ? 52
        : MIN_TOOL_BAR_HEIGHT || 72;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={{flexDirection: 'column'}}>
          {this.renderSuggestionsView()}
          {this.renderMediaView()}
          {this.renderQuickRepliesView(theme)}
          <View
            style={[
              styles.primary,
              this.props.primaryStyle as ViewStyle,
              {
                minHeight: normalize(minHeight),
                backgroundColor: theme?.v3?.footer?.bg_color || '#6975860D',
              },
            ]}>
            {this.isShowActions() && this.renderActions()}
            {theme?.v3?.footer?.buttons?.microphone?.show
              ? this.state.isSTTViewShow
                ? this.renderSTTView()
                : this.renderComposer()
              : this.renderComposer()}
            {this.isShowActions() && this.renderSend()}
          </View>
        </View>
        {this.renderAccessory()}
        {this.renderSpeechToText()}
      </View>
    );
  }
}
