import React, {Component} from 'react';
import {View, Text} from 'react-native';
import dayjs from 'dayjs';
import Week from './Week';
import normalize from './normalizeText';

dayjs.extend(require('dayjs/plugin/advancedFormat'));

const styles = {
  month: {},
  week: {
    flexDirection: 'row',
    marginVertical: 5,
    // justifyContent: 'space-between',
  },
  dayName: {
    flexGrow: 1,
    flexBasis: 1,
    textAlign: 'center',
    color: '#555555',
    opacity: 0.9,
    fontWeight: '500',
    fontSize: normalize(12),
  },
};

export default class Month extends Component {
  render() {
    const {
      customStyles = {},
      mode,
      date,
      startDate,
      endDate,
      focusedInput,
      currentDate,
      focusedMonth,
      onDatesChange,
      isDateBlocked,
      onDisableClicked,
      selectedBgColor,
      selectedTextColor,
    } = this.props;
    const dayNames = []; // store week's each day title
    const weeks = [];
    const startOfMonth = focusedMonth?.clone()?.startOf('month');
    //?.startOf('week'); // make startOfMonth is immutable
    const endOfMonth = focusedMonth?.clone?.()?.endOf('month'); // same logic as below

    // get the interval of week of first day and last day
    const currentDate1 = startOfMonth ? dayjs(startOfMonth) : dayjs();
    //console.log("currentDate1 --->:",currentDate1);
    const weekStart = currentDate1.clone().startOf('week');
    const weekEnd = currentDate1.clone().endOf('week');
    let currentDay = weekStart;
    // console.log("currentDay.isBefore(weekEnd) --->:",currentDay.isBefore(weekEnd));
    // console.log("currentDay.isSame(weekEnd) --->:",currentDay.isSame(weekEnd));
    while (currentDay.isBefore(weekEnd) || currentDay.isSame(weekEnd)) {
      dayNames.push(
        <Text
          key={currentDay.format('YYYY-MM-DD')}
          style={[styles.dayName, customStyles.dayNameText]}>
          {currentDay.format('dd')[0]}
        </Text>,
      );
      currentDay = currentDay.add(1, 'day');
    }
    const weekRange = [];
    currentDay = weekStart;
    // console.log("weekStart --->:",weekStart);
    //console.log("weekEnd --->:",weekEnd);
    // console.log("currentDay.isSame(weekEnd) --->:",currentDay.isSame(weekEnd));
    // console.log("currentDay.isBefore(weekEnd) --->:",currentDay.isSame(weekEnd));
    while (currentDay.isBefore(endOfMonth) || currentDay.isSame(weekEnd)) {
      // console.log("currentDay --->:",currentDay);
      weekRange.push(currentDay);
      currentDay = currentDay.add(7, 'day');
    }

    //console.log("weekRange --->:",weekRange);
    weekRange.forEach(week => {
      //console.log("week --->:",week);
      weeks.push(
        <Week
          customStyles={customStyles}
          key={week.format('YYYY-MM-DD')}
          mode={mode}
          date={date}
          startDate={startDate}
          endDate={endDate}
          focusedInput={focusedInput}
          currentDate={currentDate}
          focusedMonth={focusedMonth}
          startOfWeek={week}
          onDatesChange={onDatesChange}
          isDateBlocked={isDateBlocked}
          onDisableClicked={onDisableClicked}
          selectedBgColor={selectedBgColor}
          selectedTextColor={selectedTextColor}
          startOfMonth={startOfMonth}
          endOfMonth={endOfMonth}
        />,
      );
    });
    return (
      <View style={styles.month}>
        <View style={styles.week}>{dayNames}</View>
        {weeks}
      </View>
    );
  }
}
