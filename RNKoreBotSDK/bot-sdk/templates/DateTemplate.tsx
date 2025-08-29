import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import ComposePicker from '../components/datePicker/ComposePicker';
import BotText from './BotText';
import {normalize} from '../utils/helpers';
import {TEMPLATE_TYPES} from '../constants/Constant';
import Color from '../theme/Color';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Load English locale for formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

interface DateTemplateProps extends BaseViewProps {}
interface DateTemplateState extends BaseViewState {
  startDate: Date | null;
  endDate: Date | null;
  isPickerVisible: boolean;
}

export default class DateTemplate extends BaseView<
  DateTemplateProps,
  DateTemplateState
> {
  constructor(props: DateTemplateProps) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      isPickerVisible: false,
    };
  }

  private getPickerMode(): string {
    return this.props.payload?.template_type ===
      TEMPLATE_TYPES.DATE_RANGE_TEMPLATE
      ? 'range'
      : 'single';
  }

  private handleConfirm = (dateObj: any) => {
    // console.log('onConfirm ---->:', dateObj);
    if (!dateObj) {
      return;
    }
    if (this.props.onListItemClick) {
      this.props.onListItemClick(
        this.props.payload.template_type,
        dateObj,
      );
    }
  };

  private getStartDate = () => {
    let sDate = this.props.payload?.startDate
      ? dayjs(this.props.payload?.startDate, this.props.payload?.format, true)
      : undefined;

    if (!sDate?.isValid()) {
      return dayjs();
    }
    return sDate;
  };
  private getBlockBeforeDate = () => {
    let sDate = this.getStartDate();
    if (!this.props.payload?.endDate && sDate) {
      sDate = sDate.subtract(1, 'day');
    }

    return sDate;
  };
  private getEndDate = () => {
    let eDate = this.props.payload?.endDate
      ? dayjs(this.props.payload?.endDate, this.props.payload?.format, true)
      : undefined;
    // if (!eDate?.isValid()) {
    //   return dayjs();
    // }
    return eDate;
  };
  private getCurrentDate(): any {
    let startDate = this.getStartDate();
    if (startDate) {
      return startDate;
    }
    return dayjs();
  }

  render() {
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload?.text && (
          <BotText
            text={
              this.props.payload?.text_message?.trim() ||
              this.props.payload?.text?.trim()
            }
            isFilterApply={true}
            isLastMsz={!this.isViewDisable()}
            theme={this.props.theme}
          />
        )}
        <ComposePicker
          modalVisible={!this.isViewDisable()}
          customStyles={customStyles}
          selectedBgColor={customStyles.styles.selectedBgColor}
          selectedTextColor={customStyles.styles.selectedTextColor}
          currentDate={this.getCurrentDate()}
          ButtonTextStyle={styles.btn_text}
          headerText={this.props.payload?.title}
          mode={this.getPickerMode()}
          calendarBgColor={Color.white}
          blockBefore={this.getBlockBeforeDate()}
          blockAfter={this.getEndDate()}
          returnFormat={this.props.payload?.format}
          onConfirm={this.handleConfirm}
        />
      </View>
    );
  }
}
const customStyles = {
  styles: {
    selectedBgColor: '#4751B1',
    selectedTextColor: Color.white,
    textColor: '#555555',
  },

  placeholderText: {fontSize: normalize(20)}, // placeHolder style
  headerStyle: {
    backgroundColor: 'rgba(71, 81, 177, 1)',
    borderTopRightRadius: 3,
    borderTopLeftRadius: 2,
  },
  headerMarkTitle: {
    color: Color.white,
    fontSize: normalize(18),
    fontWeight: '500',
  }, // title mark style
  headerDateTitle: {
    //color: Color.carrot,
  }, // title Date style
  headerDateSingle: {
    color: Color.white,
    fontSize: normalize(18),
    fontWeight: '500',
  },
  contentInput: {}, //content text container style
  contentText: {}, //after selected text style
  monthPickerText: {}, //focused month picker text style
  datePickerText: {}, //calendar dates text style
  dayNameText: {}, //day of week title text style (M, T, W, T, F, S, S)
};

const styles = StyleSheet.create({
  btn_text: {color: customStyles.styles.textColor, fontSize: normalize(17)},
});
