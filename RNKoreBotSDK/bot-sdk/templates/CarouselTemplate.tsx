/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {normalize} from '../utils/helpers';

import Carousel from 'react-native-reanimated-carousel';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import {getButtonTheme} from '../theme/themeHelper';
import {isAndroid, isIOS} from '../utils/PlatformCheck';
const windowWidth = Dimensions.get('window').width;

interface CarouselProps extends BaseViewProps {}
interface CarouselState extends BaseViewState {
  elements?: any;
}
export default class CarouselTemplate extends BaseView<
  CarouselProps,
  CarouselState
> {
  private max_btn_count = 0;

  constructor(props: CarouselProps) {
    super(props);
    this.state = {
      elements: null,
    };
  }

  componentDidMount() {
    const payload = this.props.payload;
    payload?.elements.map((item: any) => {
      if (this.max_btn_count < item?.buttons.length) {
        this.max_btn_count = item?.buttons.length;
      }
    });

    this.setState({
      elements: payload.elements,
    });
  }

  private getSingleCarouselView = (
    item: any,
    index: number,
    isStacked?: boolean,
  ) => {
    let btnViews = item?.buttons.map((btn: any, _index: number) => {
      return this.getSingleButtonView(
        btn,
        _index,
        item?.buttons.length,
        isStacked,
      );
    });
    let Image_Http_URL = {
      uri: item.image_url,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable, // Use cache effectively
    };
    const MainWrapper: any = item?.default_action ? TouchableOpacity : View;
    return (
      <View key={index} style={[styles.container]}>
        {/* {item?.image_url && item?.title && ( */}
        <MainWrapper
          style={{flex: 1}}
          onPress={() => {
            if (this.props.payload?.onListItemClick) {
              this.props.payload.onListItemClick(
                this.props.payload.template_type,
                item?.default_action,
              );
            }
          }}>
          <View style={{}}>
            {item?.image_url && (
              <View style={styles.image_con}>
                <FastImage source={Image_Http_URL} style={styles.image} />
              </View>
            )}
            <View>
              {item?.title && (
                <Text
                  style={[
                    styles.title,
                    {
                      color: Color.black,
                      fontFamily: this.props.theme?.v3?.body?.font?.family,
                    },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                    {},
                  ]}
                  numberOfLines={1}>
                  {item?.title}
                </Text>
              )}
              {item?.subtitle ? (
                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: Color.black,
                      fontFamily: this.props.theme?.v3?.body?.font?.family,
                    },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  ]}
                  numberOfLines={2}>
                  {item?.subtitle}
                </Text>
              ) : (
                <></>
              )}
            </View>
          </View>
          <View style={styles.stack_main}>
            {item?.topSection && (
              <View style={styles.top_sec_main}>
                <Text numberOfLines={2} style={styles.top_sec_text}>
                  {item?.topSection?.title}
                </Text>
              </View>
            )}

            {item?.middleSection && (
              <View style={styles.mid_sec_main}>
                <Text numberOfLines={2} style={styles.mid_sec_text}>
                  {item?.middleSection?.description}
                </Text>
              </View>
            )}

            {item?.bottomSection && (
              <View style={styles.bot_sec_main}>
                <Text numberOfLines={2} style={styles.bot_sec_text}>
                  {item?.bottomSection?.title}
                </Text>
                <Text style={styles.bot_sec_desc}>
                  {item?.bottomSection?.description}
                </Text>
              </View>
            )}
            {item?.default_action?.type === 'web_url' && (
              <TouchableOpacity
                onPress={() => {
                  if (this.props.payload?.onListItemClick) {
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      item?.default_action,
                    );
                  }
                }}
                style={[
                  styles.top_sec_main,
                  isIOS ? {marginTop: 5} : {marginTop: 15},
                ]}>
                <Text numberOfLines={2} style={[{color: Color.blue}]}>
                  {item?.default_action?.url}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </MainWrapper>
        <View key={index}>
          <View style={styles.btnStyles}>{btnViews}</View>
        </View>
      </View>
    );
  };
  private getSingleButtonView = (
    item: any,
    index: number,
    count: number,
    isStacked?: boolean,
  ) => {
    const bTheme = getButtonTheme(this.props?.theme);
    return (
      <TouchableOpacity
        disabled={this.isViewDisable()}
        key={index}
        onPress={() => {
          if (this.props.payload?.onListItemClick) {
            this.props.payload.onListItemClick(
              this.props.payload.template_type,
              item,
            );
          }
        }}
        style={[
          styles.btn_view,
          {
            borderRadius: 5,
          },
          isStacked && {
            borderColor: this.isViewDisable()
              ? bTheme.INACTIVE_BG_COLOR
              : bTheme.ACTIVE_BG_COLOR,
            borderWidth: 1,
          },
          {
            backgroundColor: this.isViewDisable()
              ? bTheme.INACTIVE_BG_COLOR
              : isStacked
              ? Color.white
              : bTheme.ACTIVE_BG_COLOR,
          },
        ]}>
        {/* <View style={styles.line} /> */}
        <View style={[styles.main_view_1]}>
          <Text
            style={[
              styles.item_text,
              {
                color: this.isViewDisable()
                  ? bTheme.INACTIVE_TXT_COLOR || bTheme.ACTIVE_TXT_COLOR
                  : this.props?.theme?.v3?.body?.buttons?.color || Color.white,
                fontFamily: this.props?.theme?.v3?.body?.font?.family,
              },
              isStacked &&
                !this.isViewDisable() && {
                  color: bTheme.ACTIVE_BG_COLOR,
                },
            ]}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  private getTemplateWidth = () => {
    const value = this.props?.theme?.v3?.body?.icon?.show
      ? normalize(50)
      : normalize(30);
    return windowWidth - value;
  };

  private renderCarouselView = (list: any) => {
    if (!list || list?.length <= 0) {
      return <></>;
    }

    const isStacked = this.props.payload?.carousel_type === 'stacked' || false;

    const width = this.getTemplateWidth();
    if (isStacked) {
      const height1 = normalize(150) + normalize(42) * this.max_btn_count;
      return (
        <View style={{marginTop: 20}}>
          <Carousel
            loop={false}
            width={windowWidth * 0.85} // Reduce width to allow adjacent items to show
            height={height1}
            data={list}
            pagingEnabled
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 140, // Fine-tune offset for visibility
              parallaxAdjacentItemScale: 0.6,
            }}
            style={{overflow: 'visible'}} // Ensure overflow is visible
            snapEnabled
            renderItem={({item, index}: any) => (
              <View style={[{}, styles.shadowContainer1]}>
                {this.getSingleCarouselView(item, index, true)}
              </View>
            )}
          />
        </View>
      );
    }
    const height = normalize(320) + normalize(42) * this.max_btn_count;
    return (
      <Carousel
        loop={false}
        width={width}
        height={height}
        //autoPlay={true}
        data={list}
        mode="parallax"
        //scrollAnimationDuration={5000}
        onSnapToItem={index => console.log('parallax current index:', index)}
        renderItem={({item, index}: any) => (
          <View style={[{}, styles.shadowContainer]}>
            {this.getSingleCarouselView(item, index)}
          </View>
        )}
      />
    );
  };

  render() {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={[styles.sub_container, isAndroid ? {} : {}]}>
        {this.renderCarouselView(this.state.elements)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bot_sec_desc: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: 'normal',
  },
  bot_sec_text: {
    flex: 1,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: 'normal',
  },
  bot_sec_main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mid_sec_text: {
    flex: 1,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: 'normal',
  },
  mid_sec_main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  top_sec_text: {
    flex: 1,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '700',
  },
  top_sec_main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stack_main: {
    flex: 1,
    marginLeft: 10,
    marginEnd: 5,
  },
  sub_container: {
    backgroundColor: Color.white,
    // flex: 1, //Comment for BotSDK, uncomment for Templates NPM lib
    /*
    for Template npm lib
     "react-native-reanimated-carousel": "^3.4.0”,
     For  BotSDK NPM lib
    "react-native-reanimated-carousel": “^3.1.5”,
    */
  },
  image: {
    height: normalize(150),
    width: '90%',
    resizeMode: 'stretch',
    //margin: 0,
    marginTop: 10,
    borderRadius: 5,
    borderColor: Color.black,
    borderWidth: StyleSheet.hairlineWidth,
  },
  image_con: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  shadowContainer: {
    flex: 1,

    justifyContent: 'center',
    marginRight: '18.5%',
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'white', // Set the background color of the view
    // borderRadius: 10, // Optional: Set borderRadius for rounded corners
    padding: 1, // Optional: Set padding for inner content
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  shadowContainer1: {
    flex: 1,

    justifyContent: 'center',
    //marginRight: '20.5%',
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EBECF1',
    backgroundColor: 'white', // Set the background color of the view
    // borderRadius: 10, // Optional: Set borderRadius for rounded corners
    padding: 1, // Optional: Set padding for inner content
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  container: {
    flex: 1,
    // padding: 5,
    backgroundColor: Color.white,
    borderRadius: 10,
    marginBottom: 5,
    marginRight: 5,
    // width: width * 0.6,
  },

  btnStyles: {
    //flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontStyle: 'normal',
    fontFamily: 'Inter',
    marginStart: 10,
    marginBottom: 5,
    marginEnd: 10,
    alignSelf: 'flex-start',
    marginTop: 0,
    fontWeight: '500',
  },

  subtitle: {
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Inter',
    marginStart: 10,
    marginBottom: 5,
    marginEnd: 10,
    alignSelf: 'flex-start',
    marginTop: 0,
    opacity: 0.8,
  },

  btn_view: {
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginLeft: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  line: {backgroundColor: Color.white, width: '100%', height: normalize(1.3)},

  item_text: {
    fontFamily: 'Inter',
    alignSelf: 'center',
    color: 'white',
    padding: 5,
    textTransform: 'uppercase',
    fontSize: TEMPLATE_STYLE_VALUES.SUB_TEXT_SIZE,
  },
  main_view_1: {margin: 5, padding: 3},
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: windowWidth * 0.8,
    height: 200,
    overflow: 'hidden',
    borderRadius: 15,
  },
  image1: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title1: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
