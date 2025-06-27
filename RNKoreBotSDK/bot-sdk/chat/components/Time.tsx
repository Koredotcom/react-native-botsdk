import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Load English locale for formatting

import Color from '../../theme/Color';
import {normalize} from '../../utils/helpers';
import BaseView, {BaseViewProps, BaseViewState} from '../../templates/BaseView';
import {ThemeContext} from '../../theme/ThemeContext';

import 'dayjs/locale/en'; // Load English locale for formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

interface TimeProps extends BaseViewProps {
  currentMessage?: {
    createdOn?: any;
  };
  createdOn?: any;
  containerStyle?: {
    left?: any;
    right?: any;
    center?: any;
  };
  timeFormat?: string;
  timeTextStyle?: {
    left?: any;
    right?: any;
    center?: any;
  };
}
interface TimeState extends BaseViewState {}

const containerStyle = {
  //marginLeft: 5,
  // marginRight: 10,
  marginBottom: 5,
  backgroundColor: 'transparent',
};

const textStyle = {
  fontSize: normalize(10),
  backgroundColor: 'transparent',
  textAlign: 'right',
  marginTop: 5,
  opacity: 0.8,
};

const styles = {
  main_con: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    minHeight: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: StyleSheet.create({
    container: {
      ...containerStyle,
      marginTop: 1,
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle,
    },
  }),
  center: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
      marginTop: 0,
    },
    text: {
      // color: Color.white,
      ...textStyle,
    },
  }),
};

export default class Time extends BaseView<TimeProps, TimeState> {
  static contextType = ThemeContext;
  // private actionSheet: any;
  constructor(props: TimeProps) {
    super(props);
    // let {actionSheet} = useChatContext();
    // this.actionSheet = BotChatContext;
  }

  static defaultProps: {
    position: 'left';
    currentMessage: {
      createdOn: null;
    };
    containerStyle: {};
    timeFormat: {};
    timeTextStyle: {};
  };

  // call this function, passing-in your date
  dateToFromNowDaily = (myDate: any) => {
    const now = dayjs();
    const date = dayjs(myDate);
    const diffInDays = date.diff(now, 'day');

    if (diffInDays === -1) {
      return date.format('hh:mm A, [Yesterday]');
    } else if (diffInDays === 0) {
      return date.format('hh:mm A, [Today]');
    } else if (diffInDays === 1) {
      return date.format('hh:mm A, [Tomorrow]');
    } else if (diffInDays < -1 && diffInDays >= -7) {
      return date.format('[Last] dddd');
    } else if (diffInDays > 1 && diffInDays <= 7) {
      return date.format('hh:mm A, dddd');
    } else {
      return date.format('MM/DD/YYYY');
    }
  };

  render() {
    const {position, createdOn} = this.props;

    // console.log('currentMessage  ----->', currentMessage);

    if (createdOn && position) {
      return (
        <View
          style={[
            // containerStyle,
            styles[position].container,
          ]}>
          <Text
            style={[
              {
                fontSize: normalize(10),
                backgroundColor: 'transparent',
                // textAlign: 'right',
                marginTop: normalize(3),
                opacity: 0.8,
              },
              {
                color:
                  this.props?.theme?.v3?.body?.time_stamp?.color || '#1d2939',
                fontFamily:
                  this.props?.theme?.v3?.body?.font?.family || 'Inter',
              },
              {
                fontSize: normalize(9),
              },
            ]}>
            {' '}
            {this.dateToFromNowDaily(createdOn)}
            {/* {dayjs(currentMessage.createdOn)
              //.locale(this.actionSheet.getLocale())
              .locale('en')
              .format(timeFormat)} */}
          </Text>
        </View>
      );
    }
    return <></>;
  }
}
