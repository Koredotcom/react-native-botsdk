import * as React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {normalize} from '../utils/helpers';

//import Carousel from 'react-native-reanimated-carousel';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import {
  CustomTemplate,
  CustomViewProps,
  CustomViewState,
} from 'rn-kore-bot-sdk';
const windowWidth = Dimensions.get('window').width;

import FastImage from 'react-native-fast-image';

interface CarouselProps extends CustomViewProps {}
interface CarouselState extends CustomViewState {
  elements?: any;
}
export default class CarouselTemplate extends CustomTemplate<
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

  private getSingleCarouselView = (item: any, index: number) => {
    let btnViews = item?.buttons.map((btn: any, index: number) => {
      return this.getSingleButtonView(btn, index, item?.buttons.length);
    });
    let Image_Http_URL = {uri: item.image_url};
    return (
      <View key={index} style={[styles.container]}>
        {item?.image_url && item?.title && (
          <View style={{flex: 1}}>
            <View style={styles.image_con}>
              <FastImage source={Image_Http_URL} style={styles.image} />
            </View>
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color: Color.black,
                  },
                  botStyles.medium?.size,
                  {},
                ]}
                numberOfLines={1}>
                {item?.title}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: Color.black,
                  },
                  botStyles.medium?.size,
                ]}
                numberOfLines={4}>
                {item?.subtitle}
              </Text>
            </View>
          </View>
        )}
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
        </View>

        <View key={index}>
          <View style={styles.btnStyles}>{btnViews}</View>
        </View>
      </View>
    );
  };

  private getSingleButtonView = (item: any, index: number, count: number) => {
    // const bTheme = getButtonTheme(this.props?.theme);
    return (
      <View
        key={index}
        style={[
          styles.btn_view,
          // eslint-disable-next-line react-native/no-inline-styles
          count - 1 === index && {
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
          },
          {
            backgroundColor: this.isViewDisable() ? 'red' : 'green',
          },
        ]}>
        <View style={styles.line} />
        <TouchableOpacity
          disabled={this.isViewDisable()}
          style={[styles.main_view_1]}
          onPress={() => {
            if (this.props.payload?.onListItemClick) {
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
                color: this.isViewDisable() ? 'grey' : Color.white,
              },
            ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
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

    //const isStacked = this.props.payload?.carousel_type === 'stacked' || false;

    //const width = this.getTemplateWidth();

    return <Text>{'Corousel view'}</Text>;
    // if (isStacked) {
    //   const height1 = normalize(150) + normalize(42) * this.max_btn_count;
    //   return (
    //     <Carousel
    //       loop={false}
    //       width={width}
    //       height={height1}
    //       data={list}
    //       mode="horizontal-stack"
    //       modeConfig={{
    //         stackInterval: 30,
    //         scaleInterval: 0.09,
    //         opacityInterval: 0.01,
    //         rotateZDeg: 30,
    //         snapDirection: 'left',
    //       }}
    //       onSnapToItem={index => console.log('stack current index:', index)}
    //       renderItem={({item, index}: any) => (
    //         <View style={[{}, styles.shadowContainer]}>
    //           {this.getSingleCarouselView(item, index)}
    //         </View>
    //       )}
    //     />
    //   );
    // }
    // const height = normalize(310) + normalize(42) * this.max_btn_count;
    // return (
    //   <Carousel
    //     loop={false}
    //     width={width}
    //     height={height}
    //     //autoPlay={true}
    //     data={list}
    //     mode="parallax"
    //     //scrollAnimationDuration={5000}
    //     onSnapToItem={index => console.log('parallax current index:', index)}
    //     renderItem={({item, index}: any) => (
    //       <View style={[{}, styles.shadowContainer]}>
    //         {this.getSingleCarouselView(item, index)}
    //       </View>
    //     )}
    //   />
    // );
  };

  render() {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.sub_container}>
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
    color: Color.sub_text_color,
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
  },
  image: {
    height: normalize(150),
    width: '90%',
    resizeMode: 'stretch',
    //margin: 0,
    marginTop: 10,
    borderRadius: 5,
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
  container: {
    flex: 1,
    // padding: 5,
    backgroundColor: Color.white,
    borderRadius: 10,
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
    alignSelf: 'center',
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
    alignSelf: 'center',
    marginTop: 0,
    paddingLeft: 5,
    paddingEnd: 5,
    opacity: 0.8,
  },

  btn_view: {
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'blue',
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
});
