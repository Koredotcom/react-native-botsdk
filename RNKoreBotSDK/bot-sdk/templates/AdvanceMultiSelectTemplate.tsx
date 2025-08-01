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
import BotText from './BotText';
import {normalize} from '../utils/helpers';
import CheckBox from '../components/CustomCheckBox';
import Color from '../theme/Color';
import FastImage from 'react-native-fast-image';
import {isIOS} from '../utils/PlatformCheck';
import {getBubbleTheme} from '../theme/themeHelper';
const windowWidth = Dimensions.get('window').width;

interface AdvanceMultiSelectProps extends BaseViewProps {}
interface AdvanceMultiSelectState extends BaseViewState {
  elements?: [];
  limit?: number;
  showViewMore?: boolean;
  totalLength?: number;
}

export default class AdvanceMultiSelectTemplate extends BaseView<
  AdvanceMultiSelectProps,
  AdvanceMultiSelectState
> {
  private placeholderImage: any;
  constructor(props: AdvanceMultiSelectProps) {
    super(props);

    this.state = {
      elements: [],
      limit: 1,
      showViewMore: false,
      totalLength: 0,
    };
  }

  componentDidMount(): void {
    this.setState({
      elements: this.props.payload.elements,
      limit: this.props.payload?.showViewMore
        ? this.props.payload?.limit
          ? this.props.payload?.limit
          : 1
        : this.props.payload.elements.length,
      showViewMore: this.props.payload?.showViewMore,
      totalLength: this.props.payload.elements.length,
    });
  }

  render() {
    let selectList = this.getSelectedList();
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload?.heading && (
          <BotText
            text={this.props.payload?.heading?.trim()}
            isFilterApply={true}
            isLastMsz={!this.isViewDisable()}
            theme={this.props.theme}
          />
        )}
        {this.renderMultiSelectView(
          this.state.showViewMore
            ? this.state.elements?.slice(0, this.state.limit)
            : this.state.elements,
        )}
        {this.state.showViewMore && (
          <TouchableOpacity
            style={styles.view_more_main}
            onPress={() => {
              this.setState({
                showViewMore: false,
              });
            }}>
            <Text style={styles.view_more_text}>{'View more'}</Text>
          </TouchableOpacity>
        )}

        <View
          pointerEvents={
            selectList?.length === 0 || this.isViewDisable() ? 'none' : 'auto'
          }>
          {this.props.payload.buttons.map((btn: any, _btnIndex: number) => {
            return (
              <TouchableOpacity
                key={'btn' + _btnIndex}
                onPress={
                  selectList?.length === 0
                    ? undefined
                    : () => {
                        let itemsStr = 'Here are selected items: ';
                        selectList?.map((item: any, index: number) => {
                          if (index < selectList.length - 1) {
                            itemsStr = itemsStr + '' + item + ' ';
                          } else {
                            itemsStr = itemsStr + '' + item;
                          }
                        });

                        if (this.props.payload.onListItemClick) {
                          this.props.payload.onListItemClick(
                            this.props.payload.template_type,
                            {
                              title: itemsStr,
                              type: btn?.type,
                            },
                          );
                        }
                      }
                }
                style={[
                  styles.btn_main,
                  selectList?.length === 0
                    ? {backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR || Color.gray}
                    : {backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR || '#303f9f'},
                  // this.isViewDisable() && {backgroundColor: Color.gray},
                ]}>
                <Text style={[styles.btn_text, {color: bubbleTheme.BUBBLE_RIGHT_TEXT_COLOR || Color.white}]}>{btn?.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  private getSelectedList = () => {
    let selectList = [];

    this.state.elements?.map((ele: any) => {
      let list: [] = ele?.collection
        ?.filter((col: any) => col?.isChecked)
        .map((item: any) => {
          return item?.value;
        });

      selectList.push(...list);
    });

    return selectList;
  };

  renderMultiSelectView(elements: any) {
    if (!elements || elements?.length === 0) {
      return <></>;
    }
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    return (
      <View>
        {elements.map((item: any, index: number) => {
          return (
            <View key={'ele_' + index} style={styles.ele_main}>
              <View style={{marginBottom: 10}}>
                <Text style={styles.ele_title}>{item?.collectionTitle}</Text>
              </View>

              {this.state.elements?.[index]?.collection?.length > 1 && (
                <View style={styles.che_main}>
                  <CheckBox
                    style={styles.check_box}
                    boxType={'square'}
                    value={item?.isChecked || false}
                    // Enhanced color customization - can be overridden by item properties
                    selectedColor={bubbleTheme.BUBBLE_RIGHT_BG_COLOR || item.selectedColor || '#007AFF'} // Blue when checked
                    unselectedColor={bubbleTheme.BUBBLE_LEFT_BG_COLOR || item.unselectedColor || '#CCCCCC'} // Gray when unchecked
                    selectedBackgroundColor={item.selectedBackgroundColor || 'transparent'} // Background when checked
                    size={item.size || 24} // Checkbox size
                    borderWidth={item.borderWidth || 2} // Border thickness
                    onValueChange={value => {
                      let allElements: any = this.unselectElemets(
                        this.state.elements,
                        index,
                      );
                      allElements[index] = {
                        ...item,
                        isChecked: value,
                        collection: item?.collection.map((col: any) => {
                          return {
                            ...col,
                            isChecked: value,
                          };
                        }),
                      };

                      this.setState({
                        elements: allElements,
                      });
                    }}
                  />
                  <Text style={[styles.select_all, {marginLeft: normalize(5)}]}>
                    {'Select all'}
                  </Text>
                </View>
              )}
              {this.renderCollections(item?.collection, index)}
            </View>
          );
        })}
      </View>
    );
  }
  private unselectElemets = (elements: any, _index: number) => {
    return elements.map((item: any, index: number) => {
      if (index === _index) {
        return item;
      }

      return {
        ...item,
        isChecked: false,
        collection: item?.collection.map((col: any, _colIndex: number) => {
          return {
            ...col,
            isChecked: false,
          };
        }),
      };
    });
  };

  private renderCollections(collections: any, elementIndex: number) {
    if (!collections || collections?.length === 0) {
      return <></>;
    }
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    return (
      <View style={[styles.col_main, {width: (windowWidth / 4) * 3}]}>
        {collections.map((item: any, index: number) => {
          return (
            <View style={styles.col_item_main}>
              <View style={styles.col_check_main}>
                <CheckBox
                  style={[styles.check_box, {marginStart: normalize(4)}]}
                  value={item?.isChecked || false}
                  lineWidth={2}
                  hideBox={false}
                  boxType={'square'}
                  animationDuration={0.2}
                  onAnimationType={'stroke'}
                  offAnimationType={'stroke'}
                  // Enhanced color customization - can be overridden by item properties
                  selectedColor={bubbleTheme.BUBBLE_RIGHT_BG_COLOR || item.selectedColor || '#007AFF'} // Blue when checked
                  unselectedColor={bubbleTheme.BUBBLE_LEFT_BG_COLOR || item.unselectedColor || '#CCCCCC'} // Gray when unchecked
                  selectedBackgroundColor={item.selectedBackgroundColor || 'transparent'} // Background when checked
                  size={item.size || 24} // Checkbox size
                  borderWidth={item.borderWidth || 2} // Border thickness
                  onValueChange={value => {
                    const elements: any = this.unselectElemets(
                      this.state.elements,
                      elementIndex,
                    );
                    elements[elementIndex] = {
                      ...elements[elementIndex],
                      collection: elements[elementIndex]?.collection.map(
                        (col: any, colIndex: number) => {
                          if (colIndex === index) {
                            return {
                              ...col,
                              isChecked: value,
                            };
                          }
                          return col;
                        },
                      ),
                    };

                    const selectList = elements[
                      elementIndex
                    ]?.collection.filter((col: any) => col?.isChecked || false);

                    elements[elementIndex] = {
                      ...elements[elementIndex],
                      isChecked:
                        selectList.length === 0
                          ? false
                          : selectList.length ===
                            elements[elementIndex]?.collection?.length
                          ? true
                          : false,
                    };

                    this.setState({
                      elements,
                    });
                  }}
                />
                <ImageBackground
                  style={[
                    styles.image_view,
                    {marginLeft: normalize(7)},
                  ]}
                  source={this.placeholderImage}>
                  <FastImage
                    source={{uri: item?.image_url}}
                    style={[styles.image]}
                    resizeMode={'cover'}
                  />
                </ImageBackground>
                <View style={styles.col_item_content}>
                  <Text numberOfLines={1} style={styles.item_title}>
                    {item?.title}
                  </Text>
                  <Text numberOfLines={1} style={[styles.item_title, {fontSize: normalize(12), marginTop: 5}]}>
                    {item?.description}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn_text: {fontSize: normalize(14)},
  btn_main: {
    backgroundColor: '#303f9f',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view_more_text: {color: '#0076FF', fontSize: normalize(15)},
  view_more_main: {padding: 10},
  item_title: {
    textAlign: 'left',
    alignSelf: 'left',
    color: Color.black,
    fontWeight: 'normal',
    fontSize: normalize(14),
    flexShrink: 1,
    marginStart: 5
  },
  col_check_main: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col_item_main: {
    flexDirection: 'column',
    marginBottom: normalize(10),
    borderRadius: 5,
    borderColor: Color.black,
    borderWidth: StyleSheet.hairlineWidth,
    padding: normalize(8),
  },
  col_item_content: {
    flexDirection: 'column',
    flexShrink:1,
  },
  col_main: {marginStart: normalize(0)},
  select_all: {
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',

    color: Color.black,
    fontWeight: 'normal',
    fontSize: normalize(14),
  },
  che_main: {
    flexDirection: 'row',
    marginStart: normalize(0),
    marginBottom: normalize(10),
  },
  ele_main: {flexDirection: 'column', marginBottom: normalize(5)},
  ele_title: {
    color: Color.black,
    fontWeight: '800',
    marginTop: normalize(15),
    fontSize: normalize(15),
  },
  check_box: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: normalize(25),
  },
  image_view: {
    height: normalize(45),
    width: normalize(45),
    justifyContent: 'center',
    alignSelf: 'center',
    marginEnd: 5,
    borderColor: Color.bisque,
    borderWidth: StyleSheet.hairlineWidth / 2,
  },
  image: {
    height: normalize(35),
    width: normalize(35),
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 0,
  },
});
