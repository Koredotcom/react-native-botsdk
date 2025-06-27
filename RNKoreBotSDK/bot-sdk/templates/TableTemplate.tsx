import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BotText from './BotText';
import {normalize} from '../utils/helpers';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
const windowWidth = Dimensions.get('window').width;

const SLICE = 2;

const TABLE_TYPES = {
  RESPONSIVE: 'responsive',
  NORMAL: 'normal',
};

interface TableProps extends BaseViewProps {
  payload?: any;
  isFromViewMore?: boolean;
}
interface TableState extends BaseViewState {
  payload?: any;
}

import {SvgIcon} from '../utils/SvgIcon.js';
import Color from '../theme/Color';
import {ScrollView} from 'react-native-gesture-handler';

export default class TableTemplate extends BaseView<TableProps, TableState> {
  static propTypes: {
    payload: any;
    isFromViewMore?: boolean;
  };
  downSVG: any;
  upSVG: any;
  flatListRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      payload: undefined,
    };
  }

  componentDidMount(): void {
    this.updatePayloadValues();
  }

  componentDidUpdate(
    prevProps: Readonly<TableProps>,
    prevState: Readonly<TableState>,
    snapshot?: any,
  ): void {
    if (prevProps.payload !== this.props.payload) {
      this.updatePayloadValues();
    }
  }

  private updatePayloadValues() {
    let payload = this.props.payload;

    const elements = payload?.elements.slice(0, 3).map((element: any) => {
      let values = element.Values.map((value: any, i: number) => {
        return {
          value: value,
          title: payload?.columns?.[i]?.[0],
        };
      });

      return {
        ...element,
        isCollapse: false,
        Values: values,
      };
    });

    this.setState({
      payload: {
        elements: elements,
      },
    });
  }

  private renderTablesView = () => {
    const payload = this.state.payload;
    if (!payload) {
      return null;
    }
    let flexArry: any = [];
    return (
      <View style={[styles.mainContainer, {width: (windowWidth / 4) * 3}]}>
        <View style={styles.subContainer}>
          {this.getTableRowViews(payload?.elements, flexArry)}
          {!this.props.isFromViewMore && (
            <View>
              <View style={styles.line} />
              <TouchableOpacity
                onPress={() => {
                  if (this.props.payload?.onListItemClick) {
                    this.props.payload?.onListItemClick(
                      this.props.payload?.template_type,
                      this.props.payload,
                      true,
                      this.props.theme,
                    );
                  }
                }}
                style={styles.show_more_con}>
                <Text
                  style={[
                    styles.row_text,
                    {color: Color.blue},

                    {
                      color: Color.blue,
                      fontFamily: this.props?.theme?.v3?.body?.font?.family,
                    },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  ]}>
                  {'Show More'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  private getTableRowViews = (elements: any, flexArry: any = []) => {
    let views: any = [];

    if (!elements || elements.length === 0) {
      return null;
    }

    for (let i = 0; i < elements.length; i++) {
      let view = (
        <View key={i + '__' + i} style={styles.tr_con}>
          <View style={styles.tr_con_2}>
            {elements[i].Values.slice(0, SLICE).map(
              (value: any, index: number) => {
                return (
                  <TouchableOpacity
                    key={index + ''}
                    onPress={() => {
                      this.toggleButton(i, !elements[i].isCollapse);
                    }}
                    style={styles.tb_row_con}>
                    {elements[i].isCollapse && (
                      <Text
                        style={[
                          styles.item_title,
                          {
                            color: Color.text_color,
                            //this.props.theme?.v3?.general?.colors
                            // ?.primary_text,
                            fontFamily:
                              this.props?.theme?.v3?.body?.font?.family,
                            opacity: 0.8,
                          },
                          botStyles[
                            this.props?.theme?.v3?.body?.font?.size || 'medium'
                          ]?.size,
                        ]}>
                        {value.title}
                      </Text>
                    )}
                    <Text
                      style={[
                        {flex: flexArry[index]},
                        styles.row_text,

                        {
                          color: Color.text_color,
                          // this.props.theme?.v3?.general?.colors?.primary_text,
                          fontFamily: this.props?.theme?.v3?.body?.font?.family,
                        },
                        botStyles[
                          this.props?.theme?.v3?.body?.font?.size || 'medium'
                        ]?.size,
                      ]}>
                      {value.value}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
            <TouchableOpacity
              style={styles.icon_style}
              onPress={() => {
                this.toggleButton(i, !elements?.[i]?.isCollapse);
              }}>
              <SvgIcon
                name={elements?.[i]?.isCollapse ? 'DownSolid' : 'RightArrow'}
                width={normalize(10)}
                height={normalize(10)}
              />
            </TouchableOpacity>
          </View>

          {elements[i].isCollapse && this.renderTableItems1(elements[i])}

          {i !== elements.length - 1 && <View style={styles.line} />}
        </View>
      );

      views[i] = view;
    }

    return views;
  };

  private toggleButton = (index: number, isCollapse: boolean) => {
    let payload = this.state.payload;
    payload.elements = payload?.elements.map((element: any, i: number) => {
      if (index === i) {
        return {
          ...element,
          isCollapse: isCollapse,
        };
      }
      return {
        ...element,
        isCollapse: false,
      };
    });
    this.setState({
      payload: payload,
    });
  };

  private renderTableItems1 = (element: any) => {
    const renderedItems: any = [];
    {
      for (let i = 1; i <= element.Values.length / SLICE; i++) {
        renderedItems.push(
          this.renderTableItems(element, i * SLICE, i * SLICE + SLICE, i),
        );
      }
    }
    return renderedItems;
  };

  private renderTableItems = (
    element: any,
    fromValue: number,
    toValue: number,
    i: number,
  ): any => {
    return (
      <View key={i + ' ' + i + '_'} style={styles.ti_con}>
        {element.Values.slice(fromValue, toValue).map(
          (value: any, index: number) => {
            return (
              <View key={index + ''} style={{flex: 1}}>
                <Text
                  style={[
                    styles.item_title,
                    {
                      color: Color.text_color,
                      // this.props.theme?.v3?.general?.colors?.primary_text,
                      fontFamily: this.props?.theme?.v3?.body?.font?.family,
                      opacity: 0.8,
                    },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  ]}>
                  {value.title}
                </Text>
                <Text
                  style={[
                    {},
                    styles.row_text,

                    {
                      color: Color.text_color,
                      // this.props.theme?.v3?.general?.colors?.primary_text,
                      fontFamily: this.props?.theme?.v3?.body?.font?.family,
                    },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  ]}>
                  {value.value}
                </Text>
              </View>
            );
          },
        )}

        <View style={styles.empty_view} />
      </View>
    );
  };

  private renderTablesViewMore = () => {
    const payload = this.props.payload;
    if (!payload) {
      return null;
    }
    let flexArry: any = [];

    const Wrapper: any = this.props.isFromViewMore ? ScrollView : View;
    return (
      <View
        style={[
          [
            styles.mainContainer,
            styles.main_con2,
            {width: (windowWidth / 4) * 3},
          ],
        ]}>
        <Wrapper
          ref={(ref: any) => (this.flatListRef = ref)}
          style={[styles.sub_con]}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode="none"
          contentInsetAdjustmentBehavior="scrollableAxes"
          horizontal={true}>
          <View style={[styles.subContainer_more]}>
            <View style={[styles.subContainer2_more]}>
              {payload?.columns.map((coloum: any, i: number) => {
                flexArry[i] = coloum[0].length;
                return (
                  <Text
                    key={i + ''}
                    style={[
                      styles.titles,
                      {flex: coloum[0].length, color: '#2E3A92'},
                      {
                        fontFamily: this.props?.theme?.v3?.body?.font?.family,
                      },
                      botStyles.small?.size,
                    ]}>
                    {coloum[0]}
                  </Text>
                );
              })}
            </View>
            <View style={styles.thick_line} />
            <View style={styles.view_more_main}>
              {this.getTableRowViewsMore(payload?.elements, flexArry)}
            </View>
          </View>
        </Wrapper>
      </View>
    );
  };

  private getTableRowViewsMore = (elements: any, flexArry = []) => {
    let views: any = [];
    if (!elements || elements.length === 0) {
      return null;
    }
    for (let i = 0; i < elements.length; i++) {
      let view = (
        <View key={'_' + i + '' + i} style={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {elements[i].Values.map((value: any, index: number) => {
              return (
                <View
                  key={index + ''}
                  style={[
                    {
                      flex: flexArry[index],
                    },
                    styles.view_more_sub,
                  ]}>
                  <Text
                    style={[
                      {},
                      styles.row_text,
                      {fontSize: 13},
                      {
                        color: Color.text_color,
                        // color:
                        //   this.props.theme?.v3?.general?.colors?.primary_text,
                        fontFamily: this.props?.theme?.v3?.body?.font?.family,
                      },
                      botStyles.small?.size,
                    ]}>
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>
          {i !== elements.length - 1 && <View style={styles.line} />}
        </View>
      );

      views[i] = view;
    }

    return views;
  };

  private renderTableTemplate = () => {
    const table_design = this.props.payload?.table_design;

    switch (table_design) {
      case TABLE_TYPES.RESPONSIVE:
        return this.renderTablesView();
      case TABLE_TYPES.NORMAL:
        return this.renderTablesViewMore();
      default:
        return this.renderTablesViewMore();
    }
  };

  render() {
    if (this.props.isFromViewMore) {
      return this.renderTablesViewMore();
    }
    return this.props.payload ? (
      <View>
        {this.props.payload?.text && (
          <BotText
            text={this.props.payload?.text?.trim()}
            isLastMsz={!this.isViewDisable()}
            isFilterApply={true}
            theme={this.props.theme}
          />
        )}
        <View style={styles.mainContainer_2}>{this.renderTableTemplate()}</View>
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer_2: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  view_more_sub: {
    marginEnd: 2,
    marginStart: 2,
    paddingTop: 7,
    paddingBottom: 7,
  },
  view_more_main: {
    flexDirection: 'column',
    backgroundColor: Color.white,
  },
  sub_con: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  main_con2: {
    backgroundColor: 'transparent',
    minHeight: 50,
    marginTop: 10,
    width: windowWidth - normalize(50),
  },
  tb_row_con: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  empty_view: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.45,
  },
  ti_con: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 5,
  },
  tr_con_2: {
    flexDirection: 'row',
    padding: 5,
    flex: 1,
  },
  tr_con: {flexDirection: 'column', flex: 1},
  show_more_con: {
    backgroundColor: 'transparent',
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  icon_style: {
    alignItems: 'center',
    flex: 0.5,
    justifyContent: 'center',
  },
  item_title: {
    textAlign: 'center',
    fontSize: TEMPLATE_STYLE_VALUES.SUB_TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    fontWeight: '300',
    padding: 5,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    marginEnd: 5,
  },
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  subContainer: {
    marginTop: 10,
    flexDirection: 'column',
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    backgroundColor: Color.white,
    flex: 1,
  },
  subContainer_more: {
    flexDirection: 'column',
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    flex: 1,
    width: windowWidth - normalize(0),
    overflow: 'scroll',
    backgroundColor: 'transparent',
    //width: windowWidth - normalize(50),
  },

  subContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  subContainer2_more: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A6A7BC',
    paddingTop: 7,
    paddingBottom: 7,
  },

  row_text: {
    textAlign: 'center',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontWeight: '500',
    //padding: 12,

    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
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
    //padding: 10,

    fontWeight: 'bold',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
});
