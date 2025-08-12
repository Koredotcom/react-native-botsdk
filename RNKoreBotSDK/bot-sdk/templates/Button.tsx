import BaseView, {BaseViewProps, BaseViewState} from './BaseView';

import * as React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import Color from '../theme/Color';
import BotText from './BotText';
import {ThemeContext} from '../theme/ThemeContext';
import {BubbleTheme, ButtonTheme} from '../constants/Constant';
import {getBubbleTheme, getButtonTheme} from '../theme/themeHelper';
import { getWindowWidth } from '../charts';

interface ButtonProps extends BaseViewProps {
  buttonContainerStyle?: any;
  buttonTextStyle?: any;
}
interface ButtonState extends BaseViewState {}

export default class Button extends BaseView<ButtonProps, ButtonState> {
  static contextType = ThemeContext;
  static propTypes: {
    payload: any;
    onListItemClick?: any;
  };

  constructor(props: any) {
    super(props);
  }

  // shouldComponentUpdate(nextProps: ButtonProps) {
  //   return (
  //     !!this.props.payload &&
  //     !!nextProps.payload &&
  //     this.props.payload !== nextProps.payload
  //   );
  // }

  private getSingleButtonsViewForFlatList = (item: any, payload: any) => {
    return this.getSingleButtonView(
      item.item,
      item.index,
      item?.btheme,
      item?.bbtheme,
      payload
    );
  };

  private getSingleButtonView = (
    item: any,
    index = 0,
    btheme: ButtonTheme,
    bbtheme: BubbleTheme,
    payload: any
  ) => {
    return (
      <View key={index + ''} style={styles.item_container}>
        <TouchableOpacity
          key={index}
          style={[
            styles.btn_view,
            {
              width: payload.fullWidth ? getWindowWidth() * 0.75 : undefined,
              backgroundColor: payload.variation == 'backgroundInverted' ? bbtheme.BUBBLE_RIGHT_BG_COLOR : payload.variation == 'textInverted' ? bbtheme?.BUBBLE_LEFT_BG_COLOR : Color.white,
              borderColor: bbtheme?.BUBBLE_LEFT_BG_COLOR || '#3F51B5',
              borderWidth: payload.variation == 'backgroundInverted' ? 0 : 1,
            },
          ]}
          onPress={() => {
            if (this.props.payload.onListItemClick) {
              this.props.payload.onListItemClick(
                this.props.payload.template_type,
                item,
              );
            }
          }}>
          <Text
            style={[
              styles.item_text,
              {
                color: payload.variation == 'backgroundInverted' ? bbtheme.BUBBLE_RIGHT_TEXT_COLOR : payload.variation == 'textInverted' ? bbtheme.BUBBLE_RIGHT_BG_COLOR : btheme.ACTIVE_TXT_COLOR,
                fontFamily:
                  this.props?.theme?.v3?.body?.font?.family || 'Inter',
              },
              botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                .size,
            ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  private renderButtonsView = (payload: any) => {
    let list = payload.buttons;
    if (!list || list.length === 0) {
      return <></>;
    }
    const btheme = getButtonTheme(this.props?.theme);
    const bbtheme = getBubbleTheme(this.props?.theme);
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={{flexDirection: payload.stackedButtons || payload.fullWidth ? 'column' : 'row'}}>
        {list.map((item: any, index: any) => {
          return this.getSingleButtonsViewForFlatList({
            item,
            index,
            btheme,
            bbtheme
          }, payload);
        })}
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
            {this.renderButtonsView(this.props.payload)}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item_container: {
    flexWrap: 'wrap',
    marginBottom: 10,
    marginRight: 10,
    marginTop: 10,
  },
  mainContainer: {
    backgroundColor: Color.white,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    minWidth: TEMPLATE_STYLE_VALUES.MIN_WIDTH,
    marginRight: TEMPLATE_STYLE_VALUES.TEMPLATE_RIGHT_MARGIN,
    marginLeft: TEMPLATE_STYLE_VALUES.TEMPLATE_LEFT_MARGIN,
  },

  text: {
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },

  bottom_btns: {flexDirection: 'row', marginTop: 0},
  btn_view: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    fontWeight: 'bold',
  },

  item_text: {
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    alignSelf: 'center',
    color: Color.blue,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontWeight: 'normal',
    //marginTop: 10,
  },
  main_view_1: {
    padding: 5,
  },
  btn_views_1: {
    flexDirection: 'column',
  },
});
