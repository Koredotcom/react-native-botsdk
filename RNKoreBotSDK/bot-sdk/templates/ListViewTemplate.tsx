/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import BotText from './BotText';
import {TEMPLATE_TYPES} from '../constants/Constant';
import {getBubbleTheme} from '../theme/themeHelper';

interface ListProps extends BaseViewProps {}
interface ListState extends BaseViewState {}
const windowWidth = Dimensions.get('window').width;

let width = windowWidth*0.75;

export const LIST_TYPES = {
  web_url: 'web_url',
};
//const MAX_COUNT = 3;

export default class ListViewTemplate extends BaseView<ListProps, ListState> {
  private placeholderImage: any;
  constructor(props: any) {
    super(props);
  }

  private getSingleElementView = (
    item: any,
    index: number,
    _size: number = 0,
  ) => {
    const btheme = getBubbleTheme(this.props?.theme);
    let Image_Http_URL = {uri: item?.image_url};
    let buttons = item?.buttons ? [...item?.buttons] : []; //, ...item?.buttons, ...item?.buttons];
    return (
      <View key={index + '_' + index} style={[styles.main_view_1, {width: width, borderColor: btheme?.BUBBLE_LEFT_BG_COLOR}]}>
        <TouchableOpacity
          style={styles.sub_container}
          onPress={
            !item?.default_action
              ? undefined
              : () => {
                  //console.log('item ---->:', item);
                  if (this.props.onListItemClick) {
                    this.props.onListItemClick(
                      TEMPLATE_TYPES.LIST_VIEW_TEMPLATE,
                      item?.default_action,
                      false,
                      this.props?.theme,
                    );
                  }
                }
          }>
          {item?.image_url && (
            <View>
              <ImageBackground
                style={[styles.image_view]}
                source={this.placeholderImage}>
                <Image source={Image_Http_URL} style={[styles.image]} />
              </ImageBackground>
            </View>
          )}

          <View style={styles.sub_container_1}>
            <Text style={[styles.displayTextStyle]}>{item.title}</Text>

            <Text style={[styles.descTextStyle,{color: Color.black}]}>{item.subtitle}</Text>
          </View>
          <View style={styles.item_value_con}>
            <Text style={styles.item_value}>{item?.value}</Text>
          </View>
        </TouchableOpacity>

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
                    if (this.props.onListItemClick) {
                      this.props.onListItemClick(
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
                      botStyles.small?.size,
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

  private renderElementsView = (list: any) => {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={[{width: width, marginTop: 15}]}>
        {list?.map((item: any, index: any) => {
          return this.getSingleElementView(item, index, list.length);
        })}

        {this.props.payload?.seeMore && (
          <View
            pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
            style={styles.more_btn_container}>
            <TouchableOpacity
              style={styles.more_sub_con1}
              onPress={() => {
                let data = null;

                if (this.props?.payload?.moreData) {
                  data = this.props?.payload?.moreData;
                } else {
                  data = this.props?.payload?.elements;
                }

                let data1 = {
                  ...data,
                  heading: this.props.payload?.heading,
                };

                if (this.props.onListItemClick) {
                  this.props.onListItemClick(
                    this.props.payload.template_type,
                    data1,
                    true,
                  );
                }
              }}>
              <Text
                style={[
                  styles.more_text,
                  {
                    fontFamily: this.props.theme?.v3?.body?.font?.family,
                  },
                  botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                    ?.size,
                  {
                    textDecorationLine: 'underline',
                  },
                ]}>
                {'See more'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    if (this.props.onBottomSheetClose){
      width = windowWidth * 0.90;
    } else {
      width = windowWidth * 0.80;
    }
    const size =
      this.props.payload?.moreCount || this.props.payload.elements?.length || 0;
    return this.props.payload ? (
      <View>
        {this.props.payload?.text && (
          <BotText
            text={this.props.payload?.text?.trim()}
            isFilterApply={true}
            isLastMsz={!this.isViewDisable()}
            theme={this.props.theme}
          />
        )}
        {this.props.payload?.heading && (
          <View style={styles.sub_container_title1}>
            <Text style={[styles.displayTextHeaderStyle]}>
              {this.props.payload?.heading}
            </Text>
          </View>
        )}
        {this.renderElementsView(this.props.payload.elements.slice(0, size))}
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  item_value: {
    color: '#008000',
    fontWeight: '400',
    fontSize: normalize(13),
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
  item_value_con: { alignSelf: 'center', marginEnd: normalize(5)},
  image_view: {
    height: normalize(45),
    width: normalize(45),
    justifyContent: 'center',
    alignSelf: 'center',
    marginEnd: 5,
    borderColor: Color.bisque,
    borderWidth: StyleSheet.hairlineWidth / 2,
  },
  more_text: {
    flex: 1,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.VIEW_MORE_TEXT_COLOR,
    alignSelf: 'flex-end',
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
    marginStart: 5,
    marginEnd: 10,
    flex: 1,
  },
  sub_container_title1: {
    flexDirection: 'column',
    marginStart: 5,
    marginEnd: 10,
  },
  sub_container: {flexDirection: 'row', marginTop: 10},
  image: {
    height: normalize(45),
    width: normalize(45),
    resizeMode: 'stretch',
    margin: 0,
  },
  image_container: {
    backgroundColor: 'transparent',
    minHeight: normalize(50),
    minWidth: normalize(50),
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
    borderWidth: StyleSheet.hairlineWidth,

    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  btn_views_1: {
    backgroundColor: Color.white,
    marginBottom: 2,

    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  displayTextStyle: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    marginEnd: 10,

    //backgroundColor: 'yellow',
    textAlign: 'left',
    justifyContent: 'center',

    color: Color.text_color,
    fontWeight: '500',
  },
  displayTextHeaderStyle: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    marginTop: 10,

    //backgroundColor: 'yellow',
    textAlign: 'left',
    justifyContent: 'center',

    color: Color.text_color,
    fontWeight: '500',
  },
  descTextStyle: {
    fontWeight: '400',
    fontSize: normalize(13),
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    marginTop: 10,
    flex: 1,

    color: Color.sub_text_color,
    // backgroundColor: 'green',
  },
});
