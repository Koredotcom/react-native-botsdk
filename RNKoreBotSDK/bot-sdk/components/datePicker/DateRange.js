import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Platform} from 'react-native';
import dayjs from 'dayjs';
import normalize from './normalizeText';
import Month from './Month';
import {Picker} from '@react-native-picker/picker';
import {SvgIcon} from '../../utils/SvgIcon';
import Color from '../../theme/Color';
import {isAndroid} from '../../utils/PlatformCheck';

import 'dayjs/locale/en'; // Load English locale for formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const styles = {
  calendar: {
    backgroundColor: 'rgb(255, 255, 255)',
    //marginHorizontal: normalize(10),
  },
  headActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    //paddingLeft: 10,
    // paddingRight: 10,
  },
  headCoverContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    //height: normalize(120),
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#ff3431',
    paddingHorizontal: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headTitleText: {
    fontSize: normalize(18),
    color: 'white',
    fontWeight: 'bold',
  },
  headerDateSingle: {
    fontSize: normalize(20),
    color: 'white',
    fontWeight: 'bold',
  },
};

const min = 1900;
const max = 2100;
const interval = max - min + 1;
const rangeArray = Array.from(new Array(interval), (val, index) => index + min);

export default class DateRange extends Component {
  constructor(props) {
    super(props);
    const defalutFormat = 'MMM DD YYYY';
      // !props.mode || props.mode === 'single' ? 'ddd, MMM D' : 'MMM DD,YYYY';
    this.state = {
      focusedMonth: props.currentDate || dayjs().startOf('month'),
      currentDate: props.currentDate,
      startDate: props.startDate || '',
      endDate: props.endDate || '',
      focus: props.focusedInput || 'startDate',
      clearStart: '',
      clearEnd: '',
      clearSingle: props.currentDate?.format(defalutFormat) || 'Select Date',
      selectState: 'monthAndDate', // or year
      selectedYear: null,
      textStartDate: props.textStartDate || 'Start Date',
      textEndDate: props.textEndDate || 'End Date',
    };
  }
  previousMonth = () => {
    this.setState({
      focusedMonth: this.state.focusedMonth.add(-1, 'M'),
    });
  };
  nextMonth = () => {
    this.setState({
      focusedMonth: this.state.focusedMonth.add(1, 'M'),
    });
  };
  onDatesChange = event => {
    this.props.onDatesChange(event);
    const defalutFormat = 'MMM DD YYYY';
      // !this.props.mode || this.props.mode === 'single'
      //   ? 'ddd, MMM D'
      //   : 'MMM DD,YYYY';
    const headFormat = this.props.headFormat || defalutFormat;
    const {startDate, endDate, focusedInput, currentDate} = event;
    if (currentDate && !this.props.isDateBlocked(currentDate)) {
      this.setState({currentDate});
      this.setState({clearSingle: currentDate.format(headFormat)});
      return;
    }
    this.setState({...this.state, focus: focusedInput}, () => {
      this.setState({...this.state, startDate, endDate});
      if (endDate) {
        this.setState({
          clearStart: startDate.format(headFormat),
          clearEnd: endDate.format(headFormat),
        });
      } else {
        this.setState({
          clearStart: startDate.format(headFormat),
          clearEnd: '',
        });
      }
    });
  };
  selectYear = () => {
    this.setState({
      selectState: 'year',
      selectedYear: parseInt(this.state.focusedMonth.format('YYYY')),
    });
  };
  selectMonthAndDate = () => {
    this.setState({
      selectState: 'monthAndDate',
    });
  };
  changeYear = itemValue => {
    if (this.state.currentDate) {
      let newDate = dayjs(this.state.currentDate).year(itemValue);

      if (this.props.isDateBlocked(newDate)) {
        return;
      }
    }

    this.setState({selectedYear: itemValue});
    this.setState({
      focusedMonth: this.state.focusedMonth.year(itemValue),
      currentDate: this.state.currentDate?.year(itemValue),
    });
    const defalutFormat = 'MMM DD YYYY';
      // !this.props.mode || this.props.mode === 'single'
      //   ? 'ddd, MMM D'
      //   : 'MMM DD,YYYY';
    const headFormat = this.props.headFormat || defalutFormat;
    this.setState({clearSingle: this.state.currentDate?.format(headFormat)});
    this.selectMonthAndDate();
  };

  componentDidUpdate(preProps, preState) {
    if (preState.selectState !== this.state.selectState) {
      if (this.props.getSelectState) {
        this.props.getSelectState?.(this.state.selectState);
      }
    }
  }

  renderButton = () => {
    return (
      <View style={{}}>
        <View
          style={{
            flexWrap: 'wrap',
            alignSelf: 'flex-end',
            marginEnd: 10,
          }}>
          <TouchableOpacity
            underlayColor={'transparent'}
            onPress={() => {
              this.changeYear(this.state.selectedYear);
            }}
            style={[
              {
                padding: 5,
                paddingStart: 20,
              },
              this.props.ButtonStyle,
            ]}>
            <Text
              style={[{fontSize: 20, textAlign: 'center', color: '#555555'}]}>
              {'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    const markText = this.props.markText || '';
    const {customStyles = {}} = this.props;

    const headerContainer = {
      ...styles.headCoverContainer,
      ...customStyles.headerStyle,
    };
    const markTitleText = {
      opacity: 1,
      marginBottom: 10,
      fontSize: normalize(14),

      color: 'white',
      fontWeight: '500',
    };
    const markTitle = {
      // ...styles.headTitleText,
      color: 'white',
      //opacity: 0.8,
      marginBottom: 15,
      //fontSize: normalize(18),
      ...customStyles.headerMarkTitle,
    };
    const headerDate = {
      ...styles.headTitleText,
      ...customStyles.headerDateTitle,
    };
    const headerDateSingle = {
      ...styles.headerDateSingle,
      ...customStyles.headerDateSingle,
    };

    return (
      <View>
        <View style={headerContainer}>
          <View style={{}}>
            <Text
              style={[
                markTitleText,
                isAndroid && {
                  marginBottom: -10,
                  fontSize: normalize(17),
                  fontWeight: '400',
                },
              ]}>
              {this.props.headerText}
            </Text>

              <View style={{}}>
                <View>
                  {Platform.OS == 'ios' ? (
                    <TouchableOpacity onPress={this.selectYear}>
                      <Text style={markTitle}>
                        {this.state.focusedMonth.format('YYYY')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{}}>
                      <View
                        style={{
                          width: 150,
                          marginStart: -10,
                        }}>
                        <Picker
                          mode="dropdown"
                          prompt={this.state.selectedYear + ''}
                          selectedValue={parseInt(
                            this.state.focusedMonth.format('YYYY'),
                          )}
                          style={{
                            color: Color.white,
                            fontSize: normalize(20),
                            height: normalize(60),
                            marginBottom: this.props.mode != 'single' ? -50: -10,
                            backgroundColor: 'transparent',

                            // backgroundColor: 'yellow',
                            ...customStyles.headerMarkTitle,
                          }}
                          dropdownIconColor={
                            customStyles.headerStyle?.backgroundColor ||
                            Color.white
                          }
                          dropdownIconRippleColor={
                            customStyles.headerStyle?.backgroundColor ||
                            Color.white
                          }
                          itemStyle={{
                            fontWeight: '900',
                            height: normalize(50),
                          }}
                          onValueChange={this.changeYear}>
                          {rangeArray.map((value, index) => {
                            return (
                              <Picker.Item
                                key={index}
                                label={String(value)}
                                value={value}
                                style={{
                                  fontSize: normalize(20),
                                  fontWeight: '900',
                                }}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                    </View>
                  )}
                </View>
                {this.props.mode === 'single' && (
                  <View style={{}} onPress={this.selectMonthAndDate}>
                    <Text style={headerDateSingle}>{this.state.clearSingle}</Text>
                  </View>
                )}
              </View>
          </View>

          {this.props.mode === 'range' && (
            <View>
              <Text style={markTitle}>{markText}</Text>
              <View style={styles.dateContainer}>
                <Text style={headerDate}>
                  {this.state.clearStart
                    ? this.state.clearStart
                    : this.state.textStartDate}
                </Text>
                <Text style={styles.headTitleText} />
                <Text style={headerDate}>
                  {this.state.clearEnd
                    ? this.state.clearEnd
                    : this.state.textEndDate}
                </Text>
              </View>
            </View>
          )}
        </View>
        {this.state.selectState === 'monthAndDate' && (
          <View
            style={[
              styles.calendar,
              {backgroundColor: this.props.calendarBgColor},
            ]}>
            <View style={styles.headActionContainer}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  paddingTop: 5,
                }}
                onPress={this.previousMonth}>
                <SvgIcon
                  name={'Left'}
                  width={normalize(13)}
                  height={normalize(13)}
                  color={'#555555'}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: '#555555',
                  fontWeight: '400',
                  ...customStyles.monthPickerText,
                }}>
                {this.state.focusedMonth.format('MMMM YYYY')}
              </Text>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  paddingTop: 5,
                }}
                onPress={this.nextMonth}>
                <SvgIcon
                  name={'Right'}
                  width={normalize(13)}
                  height={normalize(13)}
                  color={'#555555'}
                />
              </TouchableOpacity>
            </View>
            <Month
              customStyles={customStyles}
              mode={this.props.mode}
              date={this.props.date}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              focusedInput={this.props.focusedInput}
              currentDate={this.state.currentDate}
              focusedMonth={this.state.focusedMonth}
              onDatesChange={this.onDatesChange}
              isDateBlocked={this.props.isDateBlocked}
              onDisableClicked={this.props.onDisableClicked}
              selectedBgColor={this.props.selectedBgColor}
              selectedTextColor={this.props.selectedTextColor}
            />
          </View>
        )}
        {/* //dfsd */}
        {this.state.selectState === 'year' && (
          <View
            style={[
              styles.calendar,
              {
                justifyContent: 'center',
                backgroundColor: this.props.calendarBgColor,
              },
            ]}>
            <Picker
              selectedValue={this.state.selectedYear}
              mode={'dropdown'}
              onValueChange={itemValue => {
                this.setState({selectedYear: itemValue});
                //
              }}>
              {rangeArray.map((value, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={String(value)}
                    value={value}
                  />
                );
              })}
            </Picker>
            {this.renderButton()}
          </View>
        )}
      </View>
    );
  }
}
