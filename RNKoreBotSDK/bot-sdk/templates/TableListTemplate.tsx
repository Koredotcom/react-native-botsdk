/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../theme/Color';
import {normalize} from '../utils/helpers';
import FastImage from 'react-native-fast-image';
import {image_size} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
const windowWidth = Dimensions.get('window').width;

interface TableListProps extends BaseViewProps {}
interface TableListState extends BaseViewState {}

export default class TableListTemplate extends BaseView<
  TableListProps,
  TableListState
> {
  private placeholderImage: any;
  constructor(props: any) {
    super(props);

    // this.placeholderImage = require('../assets/placehoder/image.png');
  }

  private renderElements(elements: any) {
    if (!elements || elements?.length === 0) {
      return <></>;
    }
    const data = elements?.[0] || null;
    if (!data) {
      return <></>;
    }

    return (
      <View style={styles.main}>
        <View style={styles.sub}>
          <Text style={styles.sectionHeader}>{data?.sectionHeader}</Text>
          <Text style={styles.sectionHeaderDesc}>
            {data?.sectionHeaderDesc}
          </Text>
        </View>
        {data?.rowItems?.map((item: any, index: number) => {
          let title = item?.title?.url
            ? item?.title?.url?.title
            : item?.title?.text?.title;
          let subtitle = item?.title?.url
            ? item?.title?.url?.subtitle
            : item?.title?.text?.subtitle;

          let value = item?.value?.url
            ? item?.value?.url?.title
            : item?.value?.text;

          const MainWrapper: any = item?.default_action
            ? TouchableOpacity
            : View;
          const TitleWrapper: any = item?.title?.url ? TouchableOpacity : View;
          const ValueWrapper: any = item?.value?.url ? TouchableOpacity : View;

          return (
            <MainWrapper
              key={index + '___'}
              onPress={() => {
                //  console.log('item?.default_action ===>:', item?.default_action);

                if (this.props.onListItemClick) {
                  this.props.onListItemClick(
                    this.props.payload.template_type,
                    item?.default_action,
                  );
                }
              }}>
              <View
                style={[
                  styles.rowItems_main,
                  {backgroundColor: item?.bgcolor || Color.white},
                  index === data?.rowItems.length - 1 && {marginBottom: 3},
                ]}>
                <ImageBackground
                  style={[
                    styles.image_view,
                    {backgroundColor: item?.bgcolor || Color.transparent},
                    item?.title?.image?.radius && {
                      borderRadius: item?.title?.image?.radius,
                    },
                    item?.title?.image?.size &&
                      image_size[item?.title?.image?.size || 'medium'],
                  ]}
                  source={this.placeholderImage}>
                  <FastImage
                    source={{uri: item?.title?.image?.image_src}}
                    style={[
                      styles.image,
                      item?.title?.image?.radius && {
                        borderRadius: item?.title?.image?.radius,
                      },
                      item?.title?.image?.size &&
                        image_size[item?.title?.image?.size || 'medium'],
                    ]}
                  />
                </ImageBackground>
                <View style={styles.rowItems_sub}>
                  <TitleWrapper
                    onPress={() => {
                      // console.log(
                      //   'item?.title?.url?.link ---->:',
                      //   item?.title?.url?.link,
                      // );

                      if (this.props.onListItemClick) {
                        this.props.onListItemClick(
                          this.props.payload.template_type,
                          {
                            ...item?.title?.url,
                            type: item?.title?.type,
                          },
                        );
                      }
                    }}
                    style={styles.rowItem_title}>
                    <Text
                      style={[
                        styles.rowItem_title_text,
                        {color: item?.title?.rowColor || Color.black},
                        TitleWrapper === TouchableOpacity && {
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      {title}
                    </Text>
                  </TitleWrapper>
                  <Text
                    style={[
                      styles.subtitle_text,
                      {color: item?.title?.rowColor || Color.black},
                    ]}>
                    {subtitle}
                  </Text>
                </View>
                <ValueWrapper
                  onPress={() => {
                    if (this.props.onListItemClick) {
                      this.props.onListItemClick(
                        this.props.payload.template_type,
                        {
                          ...item?.value,
                          url: item?.value?.url?.link,
                        },
                      );
                    }
                  }}
                  style={[
                    styles.value_main,
                    {
                      justifyContent:
                        item?.value?.layout?.align || 'flex-start',
                    },
                    //{justifyContent: 'flex-start'},
                  ]}>
                  <Text
                    style={[
                      styles.value_text,
                      {
                        color: item?.title?.rowColor || Color.black,
                        textDecorationLine:
                          ValueWrapper === TouchableOpacity
                            ? 'underline'
                            : 'none',
                      },
                    ]}>
                    {value}
                  </Text>
                </ValueWrapper>
              </View>

              {index !== data?.rowItems?.length - 1 && (
                <View style={styles.line}></View>
              )}
            </MainWrapper>
          );
        })}
      </View>
    );
  }

  render() {
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    const title = this.props?.payload?.title;
    const description = this.props?.payload?.description;

    return (
      <View
        style={[
          {width: (windowWidth / 4) * 3.2, backgroundColor: Color.white},
        ]}>
        <View style={{marginBottom: 10}}>
          {/* {title && (
            <Text style={[styles.title, {marginBottom: 5}]}>{title}</Text>
          )}
          {description && (
            <Text style={styles.sectionHeaderDesc}>{description}</Text>
          )} */}
        </View>
        <View
          style={[
            styles.main_con,
            {width: (windowWidth / 4) * 3.2, backgroundColor: Color.white, borderColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR, borderWidth: 1.0},
          ]}>
          {this.renderElements(this.props?.payload?.elements)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_con: {
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.black,
    marginBottom: normalize(10),
  },
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: Color.black,
  },
  value_text: {
    fontSize: normalize(12),
    fontWeight: '600',
  },
  value_main: {
    marginLeft: normalize(5),
  },
  subtitle_text: {
    fontSize: normalize(13),
    fontWeight: 'normal',
    flex: 1,
  },
  rowItem_title_text: {
    fontSize: normalize(15),
    fontWeight: '600',
    textDecorationLine: 'none',
    paddingBottom: 5,
    paddingRight: 5,
  },
  rowItem_title: {flex: 1},
  rowItems_sub: {
    justifyContent: 'center',
    marginLeft: normalize(8),
    flex: 1,
  },
  rowItems_main: {
    flexDirection: 'row',

    padding: normalize(8),
    // marginBottom: 3,
  },
  sectionHeaderDesc: {
    fontWeight: 'normal',
    fontSize: normalize(14),
    color: Color.black,
    opacity: 1.0,
  },
  sectionHeader: {
    fontWeight: '700',
    fontSize: normalize(15),
    color: Color.black,
  },
  title: {
    fontWeight: '600',
    fontSize: normalize(15),
    color: Color.black,
  },
  sub: {padding: normalize(8), backgroundColor: Color.white, marginTop: 3},
  main: {flexDirection: 'column'},
  image_view: {
    // marginTop: 10,
    height: normalize(50),
    width: normalize(50),
    borderColor: Color.bisque,
    borderWidth: StyleSheet.hairlineWidth / 2,
  },
  image: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'stretch',
    margin: 0,
  },
});
