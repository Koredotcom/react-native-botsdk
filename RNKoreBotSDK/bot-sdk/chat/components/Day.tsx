import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
} from 'react-native';
import dayjs from 'dayjs';

import Color from '../../theme/Color';
import {isSameDay, normalize} from '../../utils/helpers';
import {DATE_FORMAT} from '../../constants/Constant';
//import { IMessage } from './Models'

import {useChatContext} from '../BotChatContext';
import {IThemeType} from '../../theme/IThemeType';
import {botTimeStyles} from '../../theme/styles';
import 'dayjs/locale/en'; // Load English locale for formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '600',
    // opacity: 0.6,
    padding: normalize(5),
  },
});

export interface DayProps {
  currentMessage?: any;
  nextMessage?: any;
  previousMessage?: any;
  containerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textProps?: TextProps;
  dateFormat?: string;
  inverted?: boolean;
  itemIndex?: number;
  totalItemsCount?: number;
  isFirstMsz: boolean;
  theme: IThemeType;
}

export function Day({
  dateFormat = DATE_FORMAT,
  currentMessage,
  previousMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
  isFirstMsz = false,
  theme,
}: DayProps) {
  const {getLocale} = useChatContext();

  if (currentMessage == null || isSameDay(currentMessage, previousMessage)) {
    if (!isFirstMsz) {
      return null;
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text
          style={[
            styles.text,
            textStyle,

            {
              color: theme?.v3?.body?.time_stamp?.color,
              fontFamily: theme?.v3?.body?.font?.family,
              ...botTimeStyles[theme?.v3?.body?.font?.size || 'medium']?.size,
            },
          ]}>
          {dayjs(currentMessage.createdOn)
            .locale(getLocale())
            .format(dateFormat)}
        </Text>
      </View>
    </View>
  );
}
