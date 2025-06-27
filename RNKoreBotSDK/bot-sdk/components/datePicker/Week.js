import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import dayjs from 'dayjs'; // Importing the entire Day.js library
import {dates} from './dates';
import normalize from './normalizeText';

import 'dayjs/locale/en'; // Load English locale for formatting
import isBetween from 'dayjs/plugin/isBetween';
import {createDateRange} from '../../utils/helpers';
dayjs.extend(isBetween);

const styles = {
  week: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  day: {
    flexGrow: 1,
    flexBasis: 1,
    alignItems: 'center',
  },
  dayText: {
    color: '#555555',
    fontWeight: '500',
    fontSize: normalize(12),
  },
  dayBlocked: {
    backgroundColor: 'rgb(255, 255, 255)',
  },
  daySelected: {
    backgroundColor: 'rgb(71, 81, 177)',
  },
  dayDisabledText: {
    color: 'gray',
    opacity: 0.5,
    fontWeight: '400',
  },
  daySelectedText: {
    color: 'rgb(252, 252, 252)',
  },
  dayStarted: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  dayEnded: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  borderContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default class Week extends Component {
  render() {
    const {
      customStyles = {},
      mode,
      date,
      startDate,
      endDate,
      focusedInput,
      startOfWeek,
      onDatesChange,
      isDateBlocked,
      onDisableClicked,
      selectedBgColor,
      selectedTextColor,
      currentDate,
      endOfMonth,
      startOfMonth,
    } = this.props;
    const days = [];
    const endOfWeek = dayjs(startOfWeek).endOf('week'); // Ensure startOfWeek is a Day.js object

    // Function to check if two dates are in the same month
    const areDatesInSameMonth = (date1, date2) => {
      return dayjs(date1).isSame(date2, 'month');
    };

    // Create an array containing all the days in the week range
    const weekRange = [];
    let currentDay = dayjs(startOfWeek).startOf('day'); // Ensure startOfWeek is a Day.js object and start from the beginning of the day
    while (
      currentDay.isBefore(endOfWeek) ||
      currentDay.isSame(endOfWeek, 'day')
    ) {
      weekRange.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    // Iterate over each day in the week range
    weekRange.forEach(day => {
      const onPress = () => {
        if (isDateBlocked(day)) {
          onDisableClicked(day);
        } else if (mode === 'range') {
          let isPeriodBlocked = false;
          const start = focusedInput === 'startDate' ? day : startDate;
          const end = focusedInput === 'endDate' ? day : endDate;

          if (start && end) {
            createDateRange(start, end).forEach(dayPeriod => {
              if (isDateBlocked(dayPeriod)) isPeriodBlocked = true;
            });
          }
          onDatesChange(
            isPeriodBlocked
              ? dates(end, null, 'startDate')
              : dates(start, end, focusedInput),
          );
        } else if (mode === 'single') {
          onDatesChange({currentDate: day});
        } else {
          onDatesChange({date: day});
        }
      };

      // Helper functions to check date selection status
      const isDateRangeSelected = () => {
        if (mode === 'range') {
          if (startDate && endDate) {
            return (
              (day.isSame(startDate, 'day') || day.isAfter(startDate, 'day')) &&
              (day.isSame(endDate, 'day') || day.isBefore(endDate, 'day'))
            );
          }
          return (
            (startDate && day.isSame(startDate, 'day')) ||
            (endDate && day.isSame(endDate, 'day'))
          );
        }
        return date && day.isSame(date, 'day');
      };

      const isDateSelected = () => {
        if (mode === 'single') {
          return currentDate && day.isSame(currentDate, 'day');
        }
        return date && day.isSame(date, 'day');
      };

      const isDateStart = () => {
        return startDate && day.isSame(startDate, 'day');
      };

      const isDateEnd = () => {
        return endDate && day.isSame(endDate, 'day');
      };

      // Check if the day is blocked
      let isBlocked = !areDatesInSameMonth(endOfMonth, day);
      if (isDateBlocked(day)) {
        isBlocked = true;
      }

      // Check selection status for various cases
      const isRangeSelected = isDateRangeSelected();
      const isStart = isDateStart();
      const isEnd = isDateEnd();
      const isSelected = isDateSelected();

      // Apply styles based on selection status
      const dayRangeSelectedStyle = selectedBgColor
        ? [styles.daySelected, {backgroundColor: selectedBgColor}]
        : styles.daySelected;
      const daySelectedText = selectedTextColor
        ? [styles.daySelectedText, {color: selectedTextColor}]
        : styles.daySelectedText;
      const style = [
        styles.day,
        isBlocked && styles.dayBlocked,
        isRangeSelected && dayRangeSelectedStyle,
        isStart && styles.dayStarted,
        isEnd && styles.dayEnded,
      ];

      const styleText = [
        styles.dayText,
        customStyles.datePickerText,
        isBlocked && styles.dayDisabledText,
        isRangeSelected && daySelectedText,
        isSelected && daySelectedText,
      ];
      const borderContainer =
        mode === 'single' && isSelected
          ? [
              styles.borderContainer,
              {
                borderRadius: 20,
                backgroundColor: selectedBgColor
                  ? selectedBgColor
                  : styles.daySelected.backgroundColor,
              },
            ]
          : styles.borderContainer;
      days.push(
        <TouchableOpacity
          key={day.format('YYYY-MM-DD')}
          style={style}
          onPress={onPress}
          disabled={isBlocked && !onDisableClicked}>
          <View style={borderContainer}>
            <Text style={styleText}>{day.format('DD')}</Text>
          </View>
        </TouchableOpacity>,
      );
    });

    return <View style={styles.week}>{days}</View>;
  }
}
