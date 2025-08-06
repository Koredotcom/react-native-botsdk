import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import { getBubbleTheme } from '../theme/themeHelper';

interface ListProps extends BaseViewProps {}
interface ListState extends BaseViewState {}
const windowWidth = Dimensions.get('window').width;

const width = (windowWidth / 4) * 3;

export const LIST_TYPES = {
  web_url: 'web_url',
};
//const MAX_COUNT = 3;

export default class ListTemplate extends BaseView<ListProps, ListState> {
  constructor(props: any) {
    super(props);
  }

  getSingleElementView = (item: any, index: number, _size: number = 0) => {
    let Image_Http_URL = {uri: item?.image_url};
    let buttons = item?.buttons ? [...item?.buttons] : []; //, ...item?.buttons, ...item?.buttons];
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    return (
      <View key={index + '_' + index} style={[styles.main_view_1, {borderColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR}]}>
        <TouchableOpacity
          style={styles.sub_container}
          onPress={
            !item?.default_action
              ? undefined
              : () => {
                  if (this.props.payload.onListItemClick) {
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      item?.default_action,
                    );
                  }
                }
          }>
          <View>
            <View style={styles.image_container}>
              <FastImage source={Image_Http_URL} style={styles.image} />
            </View>
          </View>

          <View style={styles.sub_container_1}>
            <Text
              style={[
                styles.displayTextStyle,

                {
                  color: Color.black, ////this.props.theme?.v3?.general?.colors?.primary_text,
                  fontFamily: this.props.theme?.v3?.body?.font?.family,
                },
                botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                  ?.size,
              ]}>
              {item.title}
            </Text>

            <Text
              style={[
                styles.descTextStyle,

                {
                  //color: this.props.theme?.v3?.general?.colors?.primary_text,
                  color: Color.black,
                  fontFamily: this.props.theme?.v3?.body?.font?.family,
                },
                botStyles['small']?.size,
              ]}>
              {item.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={
            !item?.default_action
              ? undefined
              : () => {
                  if (this.props.payload.onListItemClick) {
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      item?.default_action,
                    );
                  }
                }
          }>
          <Text numberOfLines={2} style={[{color: Color.blue, marginTop: 5}]}>
            {item.default_action.url}
          </Text>
        </TouchableOpacity> */}

        {buttons && (
          <View
            pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
            style={[
              styles.buttons_container,
              buttons?.length > 0 && {marginBottom: 10},
            ]}>
            {buttons.map((btn: any, i: number) => {
              return (
                <TouchableOpacity
                  key={i + '_'}
                  onPress={() => {
                    if (this.props.payload.onListItemClick) {
                      this.props.payload.onListItemClick(
                        this.props.payload.template_type,
                        btn,
                      );
                    }
                  }}
                  style={[
                    styles.buttons_container_1,
                    {
                      backgroundColor:
                        this.props?.theme?.v3?.body?.buttons?.bg_color ||
                        '#a37645',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.btn_text,
                      {
                        color:
                          this.props?.theme?.v3?.body?.buttons?.color ||
                          '#ffffff',
                        fontFamily:
                          this.props.theme?.v3?.body?.font?.family || 'Inter',
                      },
                      botStyles['small']?.size,
                    ]}>
                    {btn?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  renderElementsView = (list: any) => {
    if (!list || list.length === 0) {
      return <></>;
    }
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={[{width: width}]}>
        {list?.map((item: any, index: any) => {
          return this.getSingleElementView(item, index, list.length);
        })}

        {this.props.payload?.buttons && (
          <View
            pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
            style={styles.more_btn_container}>
            {this.props.payload?.buttons.map((btn: any) => {
              return (
                <TouchableOpacity
                  style={styles.more_sub_con1}
                  onPress={() => {
                    if (this.props.payload.onListItemClick) {
                      this.props.payload.onListItemClick(
                        this.props.payload.template_type,
                        btn,
                        true,
                      );
                    }
                  }}>
                  <Text
                    style={[
                      styles.more_text,
                      {
                        fontFamily: this.props.theme?.v3?.body?.font?.family,
                        color: Color.black
                      },
                      botStyles[
                        this.props?.theme?.v3?.body?.font?.size || 'medium'
                      ]?.size,
                    ]}>
                    {btn?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  render() {
    return this.props.payload ? (
      <View style={styles.main_container}>
        {this.renderElementsView(this.props.payload?.elements)}
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: Color.transparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more_text: {
    flex: 1,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.VIEW_MORE_TEXT_COLOR,
    // alignSelf: 'flex-start',
    alignSelf: 'center',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
  more_sub_con1: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  more_btn_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  btn_text: {
    padding: 12,
    color: Color.white,
    fontWeight: '500',
  },
  buttons_container_1: {
    // backgroundColor: Color.blue,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    alignItems: 'center',
  },
  buttons_container: {
    flexDirection: 'column',
    // backgroundColor: 'green',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginEnd: 10,
    marginStart: 10,
  },
  sub_container_1: {
    flexDirection: 'column',
    marginStart: 10,
    flex: 1,
  },
  sub_container: {flexDirection: 'row', marginTop: 10},
  image: {
    height: normalize(55),
    width: normalize(55),
    resizeMode: 'stretch',
    borderRadius: 4,
    margin: 0,
  },
  image_container: {
    backgroundColor: 'transparent',
    minHeight: normalize(55),
    minWidth: normalize(55),
  },

  line: {
    backgroundColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },

  main_view_1: {
    paddingEnd: 5,
    paddingStart: 5,
    flexDirection: 'column',
    marginBottom: 15,
    backgroundColor: Color.white,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  btn_views_1: {
    backgroundColor: 'white',
    marginBottom: 2,

    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  displayTextStyle: {
    fontWeight: '500',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    marginBottom: 5,
    marginEnd: 10,
  },
  descTextStyle: {
    fontWeight: '400',
    fontSize: normalize(13),
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    color: '#485260',
    marginBottom: 3,
    marginEnd: 10,
    opacity: 0.6,
  },
});
