/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Popover from 'react-native-popover-view';
import RenderImage from '../utils/RenderImage';
import {normalize} from '../utils/helpers';
import {IThemeType} from '../theme/IThemeType';
import { getBubbleTheme } from '../theme/themeHelper';

interface ListButtonsProps {
  buttonsLayout: any;
  buttons: any;
  isFromMore?: boolean;
  theme?: IThemeType;
  payload?: any;
  onListItemClick: any
}
interface ListButtonsState {
  showBtnPopover?: boolean;
}

export default class ListWidgetButtonsView extends React.Component<
  ListButtonsProps,
  ListButtonsState
> {
  constructor(props: ListButtonsProps) {
    super(props);
    this.state = {
      showBtnPopover: false,
    };
  }

  private renderButtonsView = (buttonsLayout: any, buttons: any) => {
    if (!buttons || buttons?.length === 0) {
      return <></>;
    }
    const limitCount = buttonsLayout?.displayLimit?.count;

    let dButtons = buttons.slice(0, limitCount || buttons?.length);

    const bStyle = buttonsLayout?.style || 'float';

    const lCount = limitCount ? limitCount : 0;

    if (buttons?.length > lCount) {
      dButtons = [
        ...dButtons,
        {
          isMoreButton: true,
        },
      ];
    }

    return (
      <View
        style={[
          {marginBottom: 5},
          bStyle !== 'fitToWidth' && styles.btn_main2,
        ]}>
        {dButtons.map((btn: any, index: number) => {
          return (
            <View
              style={[bStyle !== 'fitToWidth' && {marginEnd: 10}]}
              key={index + '_' + index}>
              {btn?.isMoreButton
                ? this.renderMoreButton(buttons, index)
                : this.renderButtonView(btn)}
            </View>
          );
        })}
      </View>
    );
  };

  private renderMoreButton = (buttons: any, index: number) => {
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    return (
      <Popover
        key={index + ' ' + index}
        onRequestClose={() => {
          this.setState({
            showBtnPopover: false,
          });
        }}
        isVisible={this.state.showBtnPopover}
        from={
          <TouchableOpacity
            style={[styles.popover_main]}
            onPress={() => {
              this.setState({
                showBtnPopover: true,
              });
            }}>
            <Text
              style={[
                styles.more_text,
                {
                  color: bubbleTheme.BUBBLE_RIGHT_BG_COLOR,
                  fontFamily: this.props.theme?.v3?.body?.font?.family || 'Inter',
                },
              ]}>
              {'...More'}
            </Text>
          </TouchableOpacity>
        }>
        <View style={styles.btn_main}>
          {buttons.map((btn: any, index: number) => {
            return (
              <View style={{}} key={index + '_' + index}>
                {this.renderButtonView(btn, () => {
                  this.setState({
                    showBtnPopover: false,
                  });
                })}
              </View>
            );
          })}
        </View>
      </Popover>
    );
  };

  private renderButtonView = (btn: any, onBtnPress?: any) => {
    if (!btn) {
      return <></>;
    }
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    return (
      <TouchableOpacity
        onPress={() => {
          onBtnPress?.();
          if (!btn?.isMoreButton) {
            this.props.onListItemClick(
              this.props.payload?.template_type.trim(),
              btn,
            );
          }
        }}
        style={styles.btn_sub}>
        <View style={styles.btn_sub2}>
          <View style={{marginRight: 5}}>
            <RenderImage
              image={btn?.image?.image_src} //'https://picsum.photos/200/300'} //btn?.image?.image_src}
              width={15}
              height={15}
            />
          </View>
          <Text
            style={[
              styles.btn_title,
              {
                color: bubbleTheme.BUBBLE_RIGHT_BG_COLOR,
                fontFamily: this.props.theme?.v3?.body?.font?.family || 'Inter',
              },
            ]}>
            {btn?.title || btn?.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return this.renderButtonsView(this.props.buttonsLayout, this.props.buttons);
  }
}

const styles = StyleSheet.create({
  btn_title: {
    color: '#4741fa',
    fontSize: normalize(13),
  },
  btn_sub2: {flexDirection: 'row', alignSelf: 'center'},
  btn_sub: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(71, 65, 250, 0.13)',

    // flexShrink: 1,

    marginBottom: 10,
    //marginEnd: 10,
  },
  btn_main: {
    marginTop: 5,
    padding: 10,
    minWidth: normalize(150),
    // justifyContent: 'center',
    //alignItems: 'center',
  },
  more_text: {
    color: '#4741fa',
    //flexShrink: 1,

    fontSize: normalize(13),
  },
  btn_main2: {
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  opt_title_con: {padding: 10, margin: 10},

  popover_main: {
    paddingLeft: 15,
    paddingTop: 10,
    //paddingBottom: 10,
    marginRight: -5,
    //backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(71, 65, 250, 0.13)',
    minWidth: normalize(60),
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'stretch',
    margin: 0,
  },
  value_image: {
    height: normalize(22),
    width: normalize(22),
    resizeMode: 'stretch',
    borderRadius: 3,
    margin: 0,
  },
  btn_image: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'stretch',
    borderRadius: 3,
    margin: 0,
  },
  image_view: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 10,
    //alignSelf: 'center',
    height: normalize(55),
    width: normalize(55),
  },
});
