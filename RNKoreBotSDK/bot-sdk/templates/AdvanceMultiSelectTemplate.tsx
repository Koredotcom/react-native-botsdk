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
                    ? {backgroundColor: Color.gray}
                    : {backgroundColor: '#303f9f'},
                  this.isViewDisable() && {backgroundColor: Color.gray},
                ]}>
                <Text style={[styles.btn_text]}>{btn?.title}</Text>
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
                    selectedColor={item.selectedColor || '#007AFF'} // Blue when checked
                    unselectedColor={item.unselectedColor || '#CCCCCC'} // Gray when unchecked
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
                  <Text style={[styles.select_all, {marginLeft: normalize(3)}]}>
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
                  selectedColor={item.selectedColor || '#007AFF'} // Blue when checked
                  unselectedColor={item.unselectedColor || '#CCCCCC'} // Gray when unchecked
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
                    isIOS && {marginLeft: normalize(7)},
                  ]}
                  source={this.placeholderImage}>
                  <FastImage
                    source={{uri: item?.image_url}}
                    style={[styles.image]}
                    resizeMode={'cover'}
                  />
                </ImageBackground>
                <Text numberOfLines={1} style={styles.item_title}>
                  {item?.title}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn_text: {color: Color.white, fontSize: normalize(14)},
  btn_main: {
    backgroundColor: '#303f9f',
    //marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view_more_text: {color: '#0076FF', fontSize: normalize(15)},
  view_more_main: {padding: 10},
  item_title: {
    textAlign: 'center',
    alignSelf: 'center',
    color: Color.black,
    fontWeight: 'normal',
    fontSize: normalize(14),
    flexShrink: 1,
  },
  col_check_main: {
    flexDirection: 'row',
    // backgroundColor: 'yellow',
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
  col_main: {marginStart: normalize(0)},
  select_all: {
    justifyContent: 'center',
    // backgroundColor: 'red',
    textAlign: 'center',
    alignSelf: 'center',

    color: Color.black,
    fontWeight: 'normal',
    fontSize: normalize(14),
  },
  che_main: {
    flexDirection: 'row',
    marginStart: normalize(0),
    // marginTop: normalize(5),
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
    // width: normalize(50),
    // height: normalize(50),
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignSelf: 'center',
    width: normalize(20),
    height: normalize(20),
    marginEnd: normalize(10),
  },
  image_view: {
    // marginTop: 10,
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
