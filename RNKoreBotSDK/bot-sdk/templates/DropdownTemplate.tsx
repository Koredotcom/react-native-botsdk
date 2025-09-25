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
import Color from '../theme/Color';
import {normalize} from '../utils/helpers';
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
                  this.props.onListItemClick(
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
