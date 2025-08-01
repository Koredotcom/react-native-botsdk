/* eslint-disable react-native/no-inline-styles */

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
import {Picker} from '@react-native-picker/picker';
import Color from '../theme/Color';
import {normalize} from '../utils/helpers';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {isIOS} from '../utils/PlatformCheck';
import {getBubbleTheme, getButtonTheme} from '../theme/themeHelper';
import SelectDropdown from '../components/CustomSelectDropdown';
import {SvgIcon} from '../utils/SvgIcon';
const windowWidth = Dimensions.get('window').width;

interface DropdownProps extends BaseViewProps {
  buttonContainerStyle?: any;
  buttonTextStyle?: any;
}
interface DropdownState extends BaseViewState {
  selectedValue?: any;
  item?: any;
}

export default class DropdownTemplate extends BaseView<
  DropdownProps,
  DropdownState
> {
  constructor(props: DropdownProps) {
    super(props);
    this.state = {
      selectedValue: undefined,
      item: undefined,
    };
  }

  private renderDropdownNewDesign = () => {
    return (
      <SelectDropdown
        data={this.props.payload.elements}
        value={this.state.item}
        onSelect={(selectedItem, index) => {
          this.setState({
            selectedValue: selectedItem,
            item: this.props.payload.elements[index],
          });
        }}
        renderButton={(selectedItem: any, isOpened: boolean) => {
          return (
            <View style={[styles.calendar, styles.calendar1]}>
              <Text numberOfLines={1} style={styles.btn_text}>
                {selectedItem?.title || 'Select value'}
              </Text>
              <View style={{padding: 10}}>
                <SvgIcon
                  name={isOpened ? 'DownSolid' : 'RightArrow'}
                  width={normalize(15)}
                  height={normalize(15)}
                />
              </View>
            </View>
          );
        }}
        // search={false}
        // searchPlaceHolder={'Search'}
        renderItem={(selectedItem: any, index: number, isSelected: boolean, onItemPress: (item: any, index: number) => void) => {
          return (
            <TouchableOpacity 
              key={'item_' + index}
              onPress={() => {
                onItemPress(selectedItem, index);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.single_item}>
                <Text
                  style={{
                    color: isSelected ? Color.bot_blue : Color.text_color,
                    fontSize: normalize(14),
                  }}>
                  {selectedItem?.title}
                </Text>
              </View>
              <View style={styles.line} />
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  render() {
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    const btnTheme = getButtonTheme(this.props?.theme);
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload && (
          <View
            style={{
              backgroundColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR,
              padding: 5,
              borderRadius: 8,
            }}>
            {this.props.payload?.label && (
              <BotText
                text={this.props.payload?.label?.trim()}
                isFilterApply={true}
                isLastMsz={!this.isViewDisable()}
                theme={this.props.theme}
              />
            )}
            <View
              style={{
                marginTop: normalize(isIOS ? 10 : 10),
                marginBottom: normalize(isIOS ? 10 : 10),
              }}>
              {/* {this.renderDropDownView(this.props.payload.elements)} */}
              {this.renderDropdownNewDesign()}
            </View>
            <View style={styles.btn_main}>
              <TouchableOpacity
                style={[
                  styles.btn_con,
                  {
                    backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR,
                  },
                  this.isViewDisable() && {
                    backgroundColor: btnTheme?.ACTIVE_BG_COLOR,
                  },
                ]}
                onPress={() => {
                  const item = this.state.item;
                  if (!item) {
                    return;
                  }
                  this.props.payload.onListItemClick(
                    this.props.payload.template_type,
                    {
                      title: item?.title,
                      payload: item?.value,
                      type: 'postback',
                    },
                  );
                }}>
                <Text
                  style={{
                    color: this.isViewDisable()
                      ? btnTheme?.INACTIVE_TXT_COLOR
                      : bubbleTheme.BUBBLE_RIGHT_TEXT_COLOR,
                    fontSize: normalize(14),
                  }}>
                  {'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
  private renderDropDownView(elements: any): React.ReactNode {
    let mode = this.props.payload?.heading?.toLowerCase();
    if (mode !== 'dialog' && mode !== 'dropdown') {
      mode = 'dropdown';
    }

    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={[styles.calendar, {}]}>
        <Picker
          selectedValue={this.state.selectedValue}
          mode={mode}
          placeholder={this.props.payload?.placeholder}
          itemStyle={{
            fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
            color: isIOS ? Color.black : Color.white,
            //backgroundColor: 'red',
          }}
          //selectionColor={'green'}
          style={[styles.calendar, {margin: 5, backgroundColor: 'red'}]}
          onValueChange={(itemValue: any, itemIndex: number) => {
            if (itemIndex !== 0 && !this.state.selectedValue) {
              itemIndex = itemIndex - 1;
              let item = elements[itemIndex];
              // console.log('selected item_3  --------> :', item);
              this.setState({selectedValue: itemValue, item: item});

              // this.props.payload.onListItemClick(
              //   this.props.payload.template_type,
              //   {
              //     title: item?.title,
              //     payload: item?.value,
              //     type: 'postback',
              //   },
              // );
            } else if (itemIndex === 0 && !this.state.selectedValue) {
              //let item = this.props.payload?.placeholder || 'Select';
              // console.log('selected item_1  --------> :', item);
              this.setState({selectedValue: undefined, item: undefined});
            } else {
              let item = elements[itemIndex];
              //  console.log('selected item_2  --------> :', item);
              this.setState({selectedValue: itemValue, item: item});
              // this.props.payload.onListItemClick(
              //   this.props.payload.template_type,
              //   {
              //     title: item?.title,
              //     payload: item?.value,
              //     type: 'postback',
              //   },
              // );
            }
          }}>
          {!this.state.selectedValue && (
            <Picker.Item
              key={'placeholder'}
              label={this.props.payload?.placeholder}
              value={this.props.payload?.placeholder}
              style={{
                fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
                color: Color.black,
                fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
                backgroundColor: Color.white,
              }}
            />
          )}
          {elements?.map((item: any, index: any) => {
            return (
              <Picker.Item
                key={index}
                label={item?.title}
                value={item?.value}
                style={{
                  fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
                  color: Color.text_color,
                  fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
                  backgroundColor: Color.white,
                }}
              />
            );
          })}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn_text: {
    padding: 10,
    flex: 1,
    color: Color.text_color,
    fontSize: normalize(14),
  },
  btn_main: {marginTop: 10, marginBottom: 5},
  btn_con: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  calendar: {
    backgroundColor: Color.white,
    width: (windowWidth / 4) * 3,
    height: normalize(45),
    borderRadius: normalize(8),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.black,
    marginTop: normalize(5),
    marginBottom: normalize(5),
    justifyContent: 'center',

    //marginHorizontal: normalize(10),
  },
  calendar1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  single_item: {
    //padding: 10,
    height: normalize(45),
    backgroundColor: Color.white,
    width: (windowWidth / 4) * 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    //marginBottom: 10,
    paddingHorizontal: 10,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: Color.sub_text_color,
  },
});
