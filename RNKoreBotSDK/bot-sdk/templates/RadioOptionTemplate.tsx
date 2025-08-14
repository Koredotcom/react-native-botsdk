import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton} from '../components/CustomRadioButton';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import {getBubbleTheme} from '../theme/themeHelper';
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
    const initialOptions = this.props.payload.radioOptions?.map((option: any, index: number) => ({
      ...option,
      isChecked: option.isChecked || false, // Ensure isChecked property exists
    })) || [];
    
    console.log('Initial radioOptions from payload:', this.props.payload.radioOptions);
    console.log('Processed initial options:', initialOptions);
    
    this.setState({
      radioOptions: initialOptions,
    });
  }
  private onPressRadioButton = (index: number) => {
    console.log(`onPressRadioButton called for index: ${index}`);
    console.log('Current radioOptions state:', this.state.radioOptions);
    
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

    console.log('New options after mapping:', options);

    this.setState({
      radioOptions: options,
      selectedItem: options[index],
    }, () => {
      console.log('State updated. New radioOptions:', this.state.radioOptions);
      this.forceUpdate(); // Force re-render to ensure UI updates
    });
  };
  private renderRadioOptions = (radioOptions: any) => {
    if (!radioOptions || radioOptions?.length === 0) {
      return <></>;
    }
    const btheme = getBubbleTheme(this.props?.theme);
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.radio_main}>
        {radioOptions.map((item: any, index: number) => {
          console.log(`Rendering radio ${index}: isChecked=${item?.isChecked}, title=${item?.title}`);
          return (
            <RadioButton
              color={btheme?.BUBBLE_RIGHT_BG_COLOR}
              borderColor={btheme?.BUBBLE_LEFT_BG_COLOR}
              size={25}
              borderSize={1}
              id={item?.id || `option-${index}`}
              label={`${item?.title}\n${item?.value}`}
              selected={!!item?.isChecked}
              onPress={(id: string) => {
                console.log(`Radio option ${index} pressed for id: ${id}, current isChecked: ${item?.isChecked}`);
                this.onPressRadioButton(index);
              }}
            />
          );
        })}
      </View>
    );

    return <></>;
  };
  render() {
    const btheme = getBubbleTheme(this.props?.theme);
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.props.payload && (
          <View>
            {this.props.payload?.heading && (
              <Text
                style={{
                  color: Color.black,
                  fontSize: normalize(14),
                  fontWeight: 'bold',
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

                if (item && this.props.onListItemClick) {
                  this.props.onListItemClick(
                    this.props.payload.template_type,
                    {
                      title: item?.title,
                      payload: item?.value,
                      type: 'postback',
                    },
                  );
                }
              }}
              style={[styles.btn_main, {backgroundColor: btheme?.BUBBLE_RIGHT_BG_COLOR}]}>
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
