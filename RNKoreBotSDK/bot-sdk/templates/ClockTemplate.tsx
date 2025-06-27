import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BotText from './BotText';
import Color from '../theme/Color';
import {getButtonTheme} from '../theme/themeHelper';
import {normalize} from '../utils/helpers';

interface ClockProps extends BaseViewProps {}
interface ClockState extends BaseViewState {
  isShowTime?: boolean;
  isClickCancel?: boolean;
}

export default class ClockTemplate extends BaseView<ClockProps, ClockState> {
  constructor(props: ClockProps) {
    super(props);
    this.state = {
      isShowTime: false,
    };
  }

  componentDidMount(): void {
    setTimeout(() => {
      if (!this.isViewDisable()) {
        this.setState({
          isShowTime: true,
        });
      }
    }, 1000);
  }
  private handleConfirm = (date: Date) => {
    // console.log('handleConfirm date  --->:', date);
    const time = this.getCurrentTime(date);
    // console.log('handleConfirm time  --->:', time);
    this.setState(
      {
        isShowTime: false,
        isClickCancel: false,
      },
      () => {
        setTimeout(() => {
          if (this.props.payload.onListItemClick) {
            this.props.payload.onListItemClick(
              this.props.payload.template_type,
              {
                title: time,
                type: 'postback',
              },
            );
          }
        }, 500);
      },
    );
  };

  private getCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  private handleCancel = () => {
    //console.log('handleCancel date  --->:', date);
    this.setState({
      isShowTime: false,
      isClickCancel: true,
    });
  };

  render() {
    const btheme = getButtonTheme(this.props?.theme);
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload && (
          <View>
            {this.props.payload?.title && (
              <BotText
                text={this.props.payload?.title?.trim()}
                isFilterApply={true}
                isLastMsz={!this.isViewDisable()}
                theme={this.props.theme}
              />
            )}
            {this.state.isClickCancel && (
              <View>
                <TouchableOpacity
                  disabled={this.isViewDisable()}
                  style={[
                    styles.btn_main,
                    this.isViewDisable() && {
                      backgroundColor: btheme?.INACTIVE_BG_COLOR,
                    },
                  ]}
                  onPress={() => {
                    this.setState({
                      isShowTime: true,
                    });
                  }}>
                  <Text
                    style={[
                      {padding: 8},
                      {
                        color: this.isViewDisable()
                          ? btheme?.INACTIVE_TXT_COLOR
                          : Color.white,
                        fontFamily:
                          this.props?.theme?.v3?.body?.font?.family || 'Inter',
                      },
                    ]}>
                    {'Open clock'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <DateTimePickerModal
              isVisible={this.state.isShowTime}
              mode="time"
              date={new Date()}
              onConfirm={this.handleConfirm}
              onCancel={this.handleCancel}
              is24Hour={false}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn_main: {
    backgroundColor: Color.button_blue,
    width: normalize(100),
    alignItems: 'center',
    borderRadius: 5,
  },
});
