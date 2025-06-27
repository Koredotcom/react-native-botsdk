import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import BotText from './BotText';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import {normalize} from '../utils/helpers';
import Carousel from 'react-native-reanimated-carousel';
const windowWidth = Dimensions.get('window').width;

interface MiniTableProps extends BaseViewProps {}
interface MiniTableState extends BaseViewState {}

export default class MiniTableTemplate extends BaseView<
  MiniTableProps,
  MiniTableState
> {
  private renderVerticalTable = (payload: any) => {
    if (!payload) {
      return <></>;
    }
    return (
      <View style={{}}>
        {payload.elements.map((item: any, index: number) => {
          return this.renderTablesViewMore(item, true, index);
        })}
      </View>
    );
  };

  private getTemplateWidth = () => {
    // const value = this.props?.theme?.v3?.body?.icon?.show
    //   ? normalize(60)
    //   : normalize(40);
    return (windowWidth / 4) * 3;
  };

  private renderHorizontalTable = (payload: any) => {
    if (!payload) {
      return <></>;
    }

    const height = this.getColumnCount(payload) * normalize(45);
    const width = this.getTemplateWidth();
    return (
      <Carousel
        vertical={false}
        loop={false}
        width={width}
        height={height}
        data={payload.elements}
        mode="parallax"
        modeConfig={{
          // parallaxAdjacentItemScale: 0.5,
          //parallaxScrollingOffset: 100,
          parallaxAdjacentItemScale: 0.45,
        }}
        renderItem={({item, index}: any) => (
          <View style={[styles.shadowContainer]}>
            {this.renderTablesViewMore(item, false, index)}
          </View>
        )}
      />
    );
  };

  renderMiniTableTemplate() {
    const payload = this.props.payload;
    if (!payload) {
      return <></>;
    }
    let type = payload?.layout;

    switch (type) {
      case 'horizontal':
        return this.renderHorizontalTable(payload);
      case 'vertical':
        return this.renderVerticalTable(payload);
      default:
        return this.renderVerticalTable(payload);
    }
  }
  private getColumnCount(payload: any) {
    let maxColCount = 0;

    for (let i = 0; i <= payload.elements?.length; i++) {
      if (!payload?.elements[i]?.additional) {
        continue;
      }
      if (payload.elements[i]?.additional?.length > maxColCount) {
        maxColCount = payload.elements[i].additional?.length + 1;
      }
    }
    maxColCount = maxColCount + 1;

    return maxColCount;
  }

  private renderTablesViewMore = (
    element?: any,
    isVertical?: boolean,
    index?: number,
  ) => {
    // const payload = this.props.payload;
    if (!element) {
      return null;
    }
    let flexArry: any = [];

    return (
      <View key={index + ''} style={[[styles.mainContainer, styles.main_con2]]}>
        <View style={[styles.sub_con]}>
          <View style={[styles.subContainer_more]}>
            <View
              style={[
                styles.subContainer2_more,

                isVertical && {
                  paddingTop: 10,
                  paddingBottom: 10,
                },
              ]}>
              {element?.primary?.map((coloum: any, i: number) => {
                flexArry[i] = coloum?.[0]?.length;
                return (
                  <Text
                    key={i + ' ' + i}
                    style={[
                      styles.titles,
                      {
                        flex: coloum?.[0]?.length,
                        color: '#2E3A92',
                        paddingEnd: 5,
                      },
                      {
                        fontFamily: this.props?.theme?.v3?.body?.font?.family,
                      },
                      botStyles[isVertical ? 'small' : 'medium']?.size,
                      coloum?.[1] && {
                        textAlign: coloum?.[1] || 'center',
                      },
                    ]}>
                    {coloum?.[0]}
                  </Text>
                );
              })}
            </View>
            <View style={styles.thick_line}></View>
            <View style={styles.view_more_main}>
              {this.getTableRowViewsMore(element, flexArry, isVertical)}
            </View>
          </View>
        </View>
      </View>
    );
  };

  private getTableRowViewsMore = (
    element: any,
    flexArry = [],
    isVertical?: boolean,
  ) => {
    let elements = element?.additional;
    let views: any = [];
    if (!elements || elements?.length === 0) {
      return null;
    }
    for (let i = 0; i < elements?.length; i++) {
      let view = (
        <View key={'key_' + i} style={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {elements[i].map((value: any, index: number) => {
              return (
                <View
                  key={index + '_' + index + '_'}
                  style={[
                    {
                      flex: flexArry[index],
                      paddingEnd: 5,
                    },
                    styles.view_more_sub,
                    isVertical && {
                      paddingTop: 10,
                      paddingBottom: 10,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.row_text,
                      {
                        color: Color.text_color,
                        // this.props.theme?.v3?.general?.colors?.primary_text,
                        fontFamily: this.props?.theme?.v3?.body?.font?.family,
                      },
                      botStyles[isVertical ? 'small' : 'medium']?.size,
                      element?.primary?.[index][1] && {
                        textAlign: element?.primary?.[index][1] || 'center', //'right',
                      },
                    ]}>
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>
          {i !== elements?.length - 1 && <View style={styles.line}></View>}
        </View>
      );

      views[i] = view;
    }

    return views;
  };

  render() {
    return this.props.payload ? (
      <View style={{width: windowWidth}}>
        {this.props.payload?.text && (
          <BotText
            text={this.props.payload?.text?.trim()}
            isLastMsz={!this.isViewDisable()}
            isFilterApply={true}
            theme={this.props.theme}
          />
        )}
        {this.renderMiniTableTemplate()}
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  shadowContainer: {
    //flex: 1,
    // justifyContent: 'center',
    marginRight: '2.5%',
    //paddingBottom: '10%',
    //borderRadius: 10,
    //backgroundColor: 'white', // Set the background color of the view
    // borderRadius: 10, // Optional: Set borderRadius for rounded corners
    // padding: 1, // Optional: Set padding for inner content
    ...Platform.select({
      ios: {
        // shadowColor: '#000',
        // shadowOffset: {width: 0, height: 2},
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
      },
      android: {
        //elevation: 5,
      },
    }),
  },
  view_more_sub: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  view_more_main: {
    flexDirection: 'column',
  },
  sub_con: {
    flexDirection: 'row',
  },
  main_con2: {
    minHeight: 50,
    marginTop: 10,
    marginRight: 10,
  },

  mainContainer: {
    flexDirection: 'column',
  },

  subContainer_more: {
    flexDirection: 'column',
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    flex: 1,
    //  width: windowWidth - normalize(0),
    overflow: 'scroll',
    backgroundColor: Color.white,
  },

  subContainer2_more: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A6A7BC',
    paddingTop: 15,
    paddingBottom: 15,
  },

  row_text: {
    textAlign: 'center',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontWeight: '500',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
  line: {
    width: '100%',
    height: 1,
    opacity: 0.5,
    backgroundColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  thick_line: {
    height: 1,
    opacity: 1,
    backgroundColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  titles: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
});
