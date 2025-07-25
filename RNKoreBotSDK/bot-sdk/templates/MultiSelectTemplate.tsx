import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {normalize} from '../utils/helpers';
import CheckBox from '../components/CustomCheckBox';
import Color from '../theme/Color';
import {isIOS} from '../utils/PlatformCheck';
const windowWidth = Dimensions.get('window').width;

interface MultiSelectProps extends BaseViewProps {}
interface MultiSelectState extends BaseViewState {
  mPayload?: any;
}

export default class MultiSelectTemplate extends BaseView<
  MultiSelectProps,
  MultiSelectState
> {
  constructor(props: MultiSelectProps) {
    super(props);

    this.state = {
      mPayload: null,
    };
  }

  componentDidMount(): void {
    this.setState({
      mPayload: this.props.payload,
    });
  }

  private renderMultiSelectView(payload: any) {
    if (!payload?.elements || payload.elements?.length === 0) {
      return <></>;
    }

    return (
      <View style={[styles.ele_main, isIOS && {marginLeft: normalize(10)}]}>
        <View style={styles.che_main}>
          <CheckBox
            style={styles.check_box}
            boxType="square"
            value={payload?.isChecked || false}
            onValueChange={value => {
              let payload: any = this.state.mPayload;
              payload = {
                ...payload,
                isChecked: value,
                elements: this.state.mPayload?.elements.map((col: any) => {
                  return {
                    ...col,
                    isChecked: value,
                  };
                }),
              };
              this.setState({
                mPayload: payload,
              });
            }}
          />
          <Text
            style={[styles.select_all, isIOS && {marginLeft: normalize(5)}]}>
            {'Select all'}
          </Text>
        </View>
        {this.renderCollections(payload?.elements)}
      </View>
    );
  }
  renderCollections(collections: any) {
    if (!collections || collections?.length === 0) {
      return <></>;
    }

    return (
      <View style={[styles.col_main, {width: (windowWidth / 4) * 3}]}>
        {collections.map((item: any, index: number) => {
          return (
            <View style={[styles.col_item_main]}>
              <View style={styles.col_check_main}>
                <CheckBox
                  style={styles.check_box}
                  // boxType="circle"
                  value={item?.isChecked || false}
                  lineWidth={2}
                  hideBox={false}
                  boxType="square"
                  //onCheckColor={'#6F763F'}
                  //onFillColor={'#4DABEC'}
                  // onTintColor={'#F4DCF8'}
                  animationDuration={0}
                  onAnimationType={'stroke'}
                  offAnimationType={'stroke'}
                  onValueChange={value => {
                    let payload: any = this.state.mPayload;
                    payload = {
                      ...payload,
                      elements: this.state.mPayload?.elements.map(
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

                    let checkedElements = payload?.elements.filter(
                      (ele: any) => ele?.isChecked,
                    );

                    if (
                      checkedElements?.length <
                      this.state.mPayload?.elements?.length
                    ) {
                      payload = {
                        ...payload,
                        isChecked: false,
                      };
                    } else if (
                      checkedElements?.length ===
                      this.state.mPayload?.elements?.length
                    ) {
                      payload = {
                        ...payload,
                        isChecked: true,
                      };
                    }

                    this.setState({
                      mPayload: payload,
                    });
                  }}
                />

                <Text
                  numberOfLines={1}
                  style={[
                    styles.item_title,
                    isIOS && {marginLeft: normalize(5)},
                  ]}>
                  {item?.title}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  render() {
    let selectList = this.getSelectedList();
    if (!this.state.mPayload) {
      return <></>;
    }
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.renderMultiSelectView(this.state.mPayload)}
        <View pointerEvents={selectList?.length === 0 ? 'none' : 'auto'}>
          {this.props.payload.buttons.map((btn: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  let msgsStr = '';
                  let botStr = '';
                  selectList?.map((item: any, index: number) => {
                    if (index < selectList.length - 1) {
                      msgsStr = msgsStr + '' + item?.title + ',';
                      botStr = botStr + '' + item?.value + ',';
                    } else {
                      msgsStr = msgsStr + '' + item?.title;
                      botStr = botStr + '' + item?.value;
                    }
                  });

                  if (this.props.payload.onListItemClick) {
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      {
                        message: msgsStr,
                        payload: botStr,
                        type: btn.type,
                      },
                    );
                  }
                }}
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
    if (!this.state?.mPayload || !this.state?.mPayload?.elements) {
      return selectList;
    }

    selectList = this.state?.mPayload?.elements?.filter(
      (col: any) => col?.isChecked,
    );

    return selectList;
  };
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
    marginStart: normalize(30),
  },
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
  },
  col_item_main: {
    flexDirection: 'column',
    marginBottom: normalize(5),
    borderRadius: 5,
    borderColor: Color.black,
    borderWidth: StyleSheet.hairlineWidth,
    padding: normalize(8),
  },
  col_main: {marginStart: normalize(30)},
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
    marginStart: -normalize(6),
    marginTop: normalize(5),
    marginBottom: normalize(5),
  },
  ele_main: {flexDirection: 'column', marginBottom: normalize(5)},

  check_box: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: normalize(25),
  },
});
