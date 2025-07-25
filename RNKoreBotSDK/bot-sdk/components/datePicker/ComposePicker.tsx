import React, {Component} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DateRange from './DateRange';
import normalize from './normalizeText';
import dayjs from 'dayjs';
interface composeProps {
  currentDate?: any;
  textStartDate?: any;
  textEndDate?: any;
  alertMessageText?: any;
  modalVisible?: any;
  blockBefore?: any;
  blockAfter?: any;
  returnFormat?: any;
  mode?: any;
  outFormat?: any;
  onConfirm?: any;
  customStyles?: any;
  dateSplitter?: any;
  allowFontScaling?: any;
  customButton?: any;
  ButtonStyle?: any;
  ButtonTextStyle?: any;
  headFormat?: any;
  ButtonText?: any;
  markText?: any;
  calendarBgColor?: any;
  selectedBgColor?: any;
  selectedTextColor?: any;
  headerText?: any;
}
interface composeState {
  modalVisible?: any;
  allowPointerEvents?: any;
  showContent?: any;
  selected?: any;
  startDate?: any;
  endDate?: any;
  date?: any;
  focus?: any;
  currentDate?: any;
  textStartDate?: any;
  textEndDate?: any;
  alertMessageText?: any;
  selectState?: any;
}
export default class ComposePicker extends Component<
  composeProps,
  composeState
> {
  constructor(props: composeProps) {
    super(props);
    this.state = {
      modalVisible: false,
      allowPointerEvents: true,
      showContent: false,
      selected: '',
      startDate: null,
      endDate: null,
      date: new Date(),
      focus: 'startDate',
      currentDate: this.props.currentDate,
      textStartDate: props.textStartDate || 'Start Date',
      textEndDate: props.textEndDate || 'End Date',
      alertMessageText: props.alertMessageText || 'Please select a date range',
      selectState: undefined,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.modalVisible) {
        this.setState({
          modalVisible: this.props.modalVisible,
        });
      }
    }, 1000);
  }

  isDateBlocked = (date: any) => {
    // console.log('isDateBlocked date ---->:', date);
    // console.log('this.props.blockAfter ---->:', this.props.blockAfter);
    // // console.log('this.props.blockBefore ======>>:', this.props.blockBefore);
    // console.log('================== XXXXXXX ===============');
    if (this.props.blockBefore) {
      if (dayjs(date).isBefore(this.props.blockBefore)) {
        return true;
      }
    }
    if (this.props.blockAfter) {
      if (dayjs(date).isAfter(this.props.blockAfter)) {
        return true;
      }
    }
    return false;
  };
  private onDatesChange = event => {
    const {startDate, endDate, focusedInput, currentDate} = event;

    if (currentDate && !this.isDateBlocked(currentDate)) {
      this.setState({currentDate});
      return;
    }
    this.setState({...this.state, focus: focusedInput}, () => {
      this.setState({...this.state, startDate, endDate});
    });
  };
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  onCancel = () => {
    this.setModalVisible(false);
  };
  onConfirm = () => {
    if (!this.state.currentDate) {
      return 0;
    }
    let returnFormat = this.props.returnFormat || 'DD-MM-YYYY';
    const outFormat = this.props.outFormat || 'LL';
    if (!this.props.mode || this.props.mode === 'single') {
      this.setState({
        showContent: true,
        selected: this.state.currentDate?.format(returnFormat),
      });
      this.setModalVisible(false);
      if (typeof this.props.onConfirm === 'function') {
        this.props.onConfirm({
          currentDate: this.state.currentDate?.format(returnFormat.replaceAll("EEE", "ddd").toUpperCase()),
        });
      }
      return;
    }

    if (this.state.startDate && this.state.endDate) {
      const start = this.state.startDate.format(outFormat);
      const end = this.state.endDate.format(outFormat);
      this.setState({
        showContent: true,
        selected: `${start} ${this.props.dateSplitter} ${end}`,
      });
      this.setModalVisible(false);

      // returnFormat = 'DD-MM-YYYY';
      if (typeof this.props.onConfirm === 'function') {
        this.props.onConfirm({
          startDate: this.state.startDate.format(returnFormat),
          endDate: this.state.endDate.format(returnFormat),
        });
      }
    } else {
      //alert(this.state.alertMessageText);
      Alert.alert(this.state.alertMessageText);
    }
  };
  getTitleElement() {
    const {customStyles = {}, allowFontScaling} = this.props;
    // const showContent = this.state.showContent;

    return (
      <Text
        allowFontScaling={allowFontScaling}
        style={[styles.contentText, customStyles.contentText]}>
        {'Select date'}
      </Text>
    );
  }

  renderButton = () => {
    const {customButton} = this.props;

    if (customButton) {
      return customButton(this.onConfirm);
    }
    return (
      <View style={styles.main}>
        <View style={styles.btn_con}>
          <TouchableOpacity
            // underlayColor={'transparent'}
            onPress={this.onConfirm}
            style={[styles.btn_style, this.props.ButtonStyle]}>
            <Text
              style={[styles.btn_default_style]}>
              {this.props.ButtonText ? this.props.ButtonText : 'CONFIRM'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderCancelButton = () => {
    return (
      <View style={styles.can_main}>
        <View style={styles.can_main1}>
          <TouchableOpacity
            // underlayColor={'transparent'}
            onPress={this.onCancel}
            style={[styles.can_btn_default, this.props.ButtonStyle]}>
            <Text style={[styles.can_btn_text]}>
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {customStyles = {}} = this.props;

    //let style = styles.stylish;
    //style = this.props.centerAlign ? {...style} : style;
    //style = {...style, ...this.props.style};

    return (
      <Modal
        animationType="slide"
        onRequestClose={() => this.setModalVisible(false)}
        transparent={true}
        hardwareAccelerated={true}
        visible={this.state.modalVisible}>
        <View style={styles.main_con1}>
          <View style={styles.date_ran_con}>
            <DateRange
              //date={new Date()}
              headFormat={this.props.headFormat}
              customStyles={customStyles}
              markText={this.props.markText}
              onDatesChange={this.onDatesChange}
              isDateBlocked={this.isDateBlocked}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              focusedInput={this.state.focus}
              calendarBgColor={this.props.calendarBgColor || undefined}
              selectedBgColor={this.props.selectedBgColor || undefined}
              selectedTextColor={this.props.selectedTextColor || undefined}
              mode={this.props.mode || 'single'}
              currentDate={this.state.currentDate}
              textStartDate={this.state.textStartDate}
              textEndDate={this.state.textEndDate}
              headerText={this.props.headerText}
              getSelectState={selectState => {
                if (this.state?.selectState !== selectState) {
                  this.setState({
                    selectState,
                  });
                }
              }}
            />
            {this.state?.selectState !== 'year' && (
              <View style={styles.main_con}>
                {this.renderCancelButton()}
                {this.renderButton()}
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  can_btn_text: {fontSize: normalize(16), textAlign: 'left'},
  can_btn_default: {
    padding: 5,
    paddingEnd: 20,
    marginBottom: 10
  },
  can_main1: {flexWrap: 'wrap', marginStart: 10},
  can_main: {flex: 1},
  btn_default_style: {fontSize: normalize(16), textAlign: 'right'},
  btn_style: {
    padding: 5,
    paddingStart: 20,
    marginBottom: 10
  },
  main: {flex: 1},
  btn_con: {
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    marginEnd: 10,
  },
  date_ran_con: {width: '90%', borderColor: 'transparent'},
  main_con1: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignSelf: 'center',
    // alignItems: 'center',
    //backgroundColor: this.props.calendarBgColor,

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  main_con: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomEndRadius: 2,
    borderBottomStartRadius: 2,
  },
  placeholderText: {
    color: '#c9c9c9',
    fontSize: normalize(18),
  },
  contentInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: normalize(18),
  },
  stylish: {
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
