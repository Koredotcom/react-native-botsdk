import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton} from 'react-native-radio-buttons-group';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
const windowWidth = Dimensions.get('window').width;

interface RadioOptionProps extends BaseViewProps {}
interface RadioOptionState extends BaseViewState {
  radioOptions: any;
  selectedItem: any;
}

export default class RadioOptionTemplate extends BaseView<
  RadioOptionProps,
  RadioOptionState
> {
  constructor(props: RadioOptionProps) {
    super(props);

    this.state = {
      radioOptions: [],
      selectedItem: null,
    };
  }

  componentDidMount(): void {
    this.setState({
      radioOptions: this.props.payload.radioOptions,
    });
  }
  private onPressRadioButton = (index: number) => {
    let options = this.state.radioOptions.map((opt: any, optIndex: number) => {
      if (optIndex === index) {
        return {
          ...opt,
          isChecked: true,
        };
      }
      return {
        ...opt,
        isChecked: false,
      };
    });

    this.setState({
      radioOptions: options,
      selectedItem: options[index],
    });
  };
  private renderRadioOptions = (radioOptions: any) => {
    if (!radioOptions || radioOptions?.length === 0) {
      return <></>;
    }

    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.radio_main}>
        {radioOptions.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.onPressRadioButton(index);
              }}>
              <View style={styles.item_main}>
                <View>
                  <RadioButton
                    size={20}
                    borderSize={1}
                    id={item?.id} // acts as primary key, should be unique and non-empty string
                    selected={item?.isChecked}
                    onPress={(id: string) => {
                      this.onPressRadioButton(index);
                    }}
                  />
                </View>
                <View style={styles.title_main}>
                  <Text style={styles.item_title}>{item?.title}</Text>
                  <Text style={styles.item_value}>{item?.value}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );

    return <></>;
  };
  render() {
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload && (
          <View>
            {this.props.payload?.heading && (
              <Text
                style={{
                  color: Color.black,
                  fontSize: normalize(16),
                  fontWeight: 600,
                }}>
                {this.props.payload?.heading?.trim()}
                {/* isFilterApply={true}
                isLastMsz={!this.isViewDisable()}
                theme={this.props.theme} */}
              </Text>
            )}
            {this.renderRadioOptions(this.state.radioOptions)}
            <TouchableOpacity
              onPress={() => {
                const item = this.state.selectedItem?.postback;

                if (item && this.props.payload.onListItemClick) {
                  this.props.payload.onListItemClick(
                    this.props.payload.template_type,
                    {
                      title: item?.title,
                      payload: item?.value,
                      type: 'postback',
                    },
                  );
                }
              }}
              style={[styles.btn_main, {backgroundColor: '#303f9f'}]}>
              <Text style={[styles.btn_text]}>{'Confirm'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item_value: {
    color: Color.black,
    fontSize: normalize(12),
    fontWeight: '400',
    // marginBottom: 5,
    opacity: 0.5,
  },
  item_title: {
    flex: 1,
    color: Color.black,
    fontSize: normalize(14),
    fontWeight: '600',
    marginBottom: 3,
    marginTop: 5,
  },
  title_main: {flexDirection: 'column', flex: 1},
  item_main: {
    padding: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },
  radio_main: {width: (windowWidth / 4) * 3, marginBottom: 10},
  btn_main: {
    backgroundColor: '#303f9f',
    //marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    //marginStart: normalize(20),
  },
  btn_text: {color: Color.white, fontSize: normalize(14)},
});
