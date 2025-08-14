/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {convertToRNStyle, normalize, renderImage} from '../utils/helpers';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';

const BORDER = {
  WIDTH: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
  COLOR: TEMPLATE_STYLE_VALUES.BORDER_COLOR, //'#728387', //'#E0E1E9',
  RADIUS: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
  TEXT_COLOR: TEMPLATE_STYLE_VALUES.TEXT_COLOR,

  TEXT_SIZE: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
};
const windowWidth = Dimensions.get('window').width;

interface CardProps extends BaseViewProps {}
interface CardState extends BaseViewState {}

export default class CardTemplate extends BaseView<CardProps, CardState> {
  constructor(props: any) {
    super(props);
  }

  private defaultCardView = (item: any, index: any, width: number) => {
    let headerStyles: any;
    if (item?.cardHeading?.headerStyles) {
      headerStyles = convertToRNStyle(item?.cardHeading?.headerStyles);
    }

    let cardStyles: any;
    if (item?.cardStyles) {
      cardStyles = convertToRNStyle(item?.cardStyles);
    }

    let cardContentStyles: any;
    if (item?.cardContentStyles) {
      cardContentStyles = convertToRNStyle(item?.cardContentStyles);
    }
    const bubbleTheme = getBubbleTheme(this.props?.theme);

    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        key={index}
        style={[
          styles.container,
          {
            width: width,
          },
        ]}>
        <View
          pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
          style={[styles.sub_container, cardStyles]}>
          <View
            pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
            style={[
              styles.sub_container_1,
              cardContentStyles,
              item?.cardContentStyles?.['border-left'] && {
                borderColor:
                  item?.cardContentStyles['border-left']?.split(' ')?.[2] ||
                  BORDER.COLOR,
                borderLeftWidth: normalize(5),
                borderRadius: 10,
              },
            ]}>
            {item?.cardHeading?.title && (
              <View
                style={[
                  styles.header_container,
                  item?.cardHeading?.headerStyles && {
                    borderWidth: StyleSheet.hairlineWidth,
                  },
                  headerStyles,

                  !item?.cardDescription && {
                    borderBottomEndRadius: BORDER.RADIUS,
                    borderBottomStartRadius: BORDER.RADIUS,
                    borderColor: 'transparent',
                    margin: 3,
                  },
                ]}>
                {item?.cardHeading?.icon && (
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      marginTop: 5,
                      marginLeft: 8,
                    }}>
                    {renderImage({
                      image: item?.cardHeading?.icon,
                      iconShape: undefined,
                      iconSize: item?.cardHeading?.iconSize || 'small',
                    })}
                  </View>
                )}
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      styles.item_title,
                      styles.title_style,

                      headerStyles,
                      {
                        paddingEnd: 10,

                        flex: 1,
                        fontFamily:
                          this.props.theme?.v3?.body?.font?.family || 'Inter',
                      },
                      botStyles[
                        this.props?.theme?.v3?.body?.font?.size || 'medium'
                      ]?.size,
                    ]}>
                    {item?.cardHeading?.title}
                  </Text>
                  {item?.cardHeading?.description && (
                    <Text
                      style={[
                        styles.item_title,
                        styles.title_style,
                        {
                          fontWeight: 'normal',
                          paddingTop: 0,
                          fontSize: normalize(14),
                          fontFamily:
                            this.props.theme?.v3?.body?.font?.family || 'Inter',
                        },
                        botStyles['small']?.size,
                      ]}>
                      {item?.cardHeading?.description}
                    </Text>
                  )}
                </View>
              </View>
            )}
            {item?.cardDescription && (
              <View style={[styles.sub_view_container, {borderColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR || '#ff0000'}]}>
                {item?.cardDescription?.map((desc: any, index: number) => {
                  return (
                    <View key={index + ''} style={styles.desc_container}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {renderImage({
                          image: desc?.icon,
                          iconShape: undefined,
                          iconSize: desc?.iconSize,
                        })}
                      </View>
                      <Text
                        style={[
                          styles.desc_text,
                          {
                            fontFamily:
                              this.props.theme?.v3?.body?.font?.family ||
                              'Inter',
                          },
                          botStyles['small']?.size,
                        ]}>
                        {desc.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
            {item?.buttons && (
              <View style={{flexDirection: 'row'}}>
                {item?.buttons?.map((btn: any, index: number) => {
                  let buttonStyles: any;
                  if (btn?.buttonStyles) {
                    buttonStyles = convertToRNStyle(btn?.buttonStyles);
                  }

                  return (
                    <View
                      key={index + ''}
                      style={[
                        styles.buttons_container,
                        buttonStyles,

                        index === 0 && {
                          borderBottomLeftRadius: BORDER.RADIUS - 1,
                        },
                        index === item?.buttons.length - 1 && {
                          borderBottomRightRadius: BORDER.RADIUS - 1,
                          marginEnd: 0,
                        },
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          if (this.props.onListItemClick) {
                            this.props.onListItemClick(
                              this.props.payload.template_type,
                              btn,
                            );
                          }
                        }}
                        style={styles.button}>
                        <Text
                          style={[
                            styles.button_text,
                            btn?.buttonStyles && {
                              color: btn?.buttonStyles?.color || Color.black,
                            },
                            botStyles[
                              this.props?.theme?.v3?.body?.font?.size ||
                                'medium'
                            ]?.size,
                            {
                              fontFamily:
                                this.props.theme?.v3?.body?.font?.family ||
                                'Inter',
                            },
                          ]}>
                          {btn?.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  private getCardViews = (cards = []) => {
    //
    if (!cards.length) {
      return <></>;
    }

    const width = (windowWidth / 4) * 3;
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {cards.map((item: any, index: any) => {
          return this.defaultCardView(item, index, width);
        })}
      </View>
    );
  };

  render() {
    return this.props?.payload?.cards ? (
      this.getCardViews(this.props.payload.cards)
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  card_heading_desc: {
    fontWeight: 'normal',
    paddingTop: 0,
    fontSize: normalize(14),
  },
  button_text: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: normalize(15),
  },
  button: {
    //backgroundColor: 'green',
    height: normalize(40),
    justifyContent: 'center',
  },
  buttons_container: {
    flex: 1,
    //margin: StyleSheet.hairlineWidth,
    borderWidth: BORDER.WIDTH,
    borderColor: BORDER.COLOR,
    marginEnd: 2,
    backgroundColor: Color.white,
  },
  extra_icon: {
    marginStart: 5,
    marginTop: 3,
  },
  header_extra_info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
    marginEnd: 5,
    marginStart: 5,
  },
  list_card_header_icon: {
    justifyContent: 'flex-start',
    marginTop: 5,
    marginLeft: 8,
  },
  list_title_container: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
  },
  desc_text: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: normalize(14),
    paddingStart: 8,
    color: Color.black,
    //flex: 1,
  },

  desc_container: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 8,
    //flexGrow: 1,
    //flexWrap: 'wrap',
    //flex: 1,
    paddingEnd: 10,
  },
  title_style: {
    fontFamily: 'inter',
    fontSize: normalize(15),
    flexDirection: 'row',
    paddingStart: 8,
    paddingBottom: 5,
    paddingTop: 5,
  },
  header_container: {
    paddingTop: 5,
    paddingBottom: 5,
    //paddingEnd: 5,
    // marginTop: 5,
    //marginEnd: 0.2,
    flexDirection: 'row',
    //flex: 1,

    borderTopEndRadius: BORDER.RADIUS,
    borderTopStartRadius: BORDER.RADIUS,

    backgroundColor: Color.white,
    borderColor: BORDER.COLOR,
    borderWidth: 1,
  },
  sub_container_1: {
    //flex: 1,
    // marginEnd: 10,
    //marginStart: 10,
    borderWidth: BORDER.WIDTH,
    flex: 1,

    borderRadius: BORDER.RADIUS,
    borderBottomEndRadius: BORDER.RADIUS,
    borderBottomStartRadius: BORDER.RADIUS,
    borderColor: BORDER.COLOR,
  },
  sub_container: {
    flexDirection: 'column',
    backgroundColor: Color.white,
    //flex: 1,
    marginBottom: 10,
    //marginStart: 5,
    width: '100%',
    //flexShrink: 10,
    // borderBottomEndRadius: BORDER.RADIUS,
    // borderBottomStartRadius: BORDER.RADIUS,
    borderRadius: BORDER.RADIUS,
  },

  container: {
    //marginTop: 5,
    // padding:5,
    backgroundColor: 'transparent',
    // borderWidth: BORDER.WIDTH,
    // borderColor: BORDER.COLOR,
    // //borderColor: '#95B6FB',
    //flex: 1,
    //margin: 20,
    // borderRadius: BORDER.RADIUS,
    //marginBottom: 10,
    paddingBottom: 10,
  },
  sub_view_container: {
    //flex: 1,
    // marginTop: 10,
    paddingTop: 5,
    //backgroundColor: 'red',
    //borderWidth: BORDER.WIDTH,
    marginEnd: BORDER.WIDTH,
    // borderBottomWidth: BORDER.WIDTH,
    // borderLeftWidth: BORDER.WIDTH,
    // borderRightWidth: BORDER.WIDTH,
    //borderColor: '#95B6FB',
    // borderColor: '#85B7FE',
    paddingStart: 10,
    // margin: 10,
    // borderRadius: BORDER.RADIUS,
    borderBottomEndRadius: BORDER.RADIUS,
    borderBottomStartRadius: BORDER.RADIUS,
    paddingBottom: 10,
    borderWidth: 1
  },
  image_container: {
    // height: 50,
    // width: 60,
    // alignSelf: 'flex-start',
    // justifyContent: 'center',
    //borderColor: '#E4E5E7',
    //borderWidth: 1,
    // borderRadius: 4,
    ////flex: 1,
  },
  unfurlUrl4: {
    borderColor: 'gray',
    resizeMode: 'cover',
    alignSelf: 'center',
    //  borderRadius: 6,
    alignContent: 'center',
    overflow: 'hidden',
    marginTop: 3,
  },

  item_title: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.270833,
    color: '#202124',
    flex: 1,
    //marginEnd: 5,
    //backgroundColor: 'red',

    //width: '100%',
  },
  item_desc: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: normalize(14),
    letterSpacing: 0.270833,
    alignItems: 'flex-start',
    textAlign: 'justify',
    color: '#616368', //'#5F6368',
  },
});
