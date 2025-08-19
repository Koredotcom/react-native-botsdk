import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard
} from 'react-native';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
import { LocalizationManager } from '../constants/Localization';
import PinInputGroup from './PinInputGroup';
const windowWidth = Dimensions.get('window').width;
let window = windowWidth * 0.8;

interface ResetPinProps extends BaseViewProps {}
interface ResetPinState extends BaseViewState {
  inputText?: string;
  isPinMatch: boolean;
  otpValues1: Array<number>,
  otpValues2: Array<number>,
}
export default class ResetPinTemplate extends BaseView<ResetPinProps, ResetPinState> {
    constructor(props: ResetPinProps) {
        super(props);
        this.state = {
          otpValues1: Array(props?.payload?.pinLength || 4).fill(''),
          otpValues2: Array(props?.payload?.pinLength || 4).fill(''),
          inputText: '',
          isPinMatch: true,
        };
        if (this.props.onBottomSheetClose){
          window =  windowWidth * 0.9;
        }
      }
      
render() {
  const bubbleTheme = getBubbleTheme(this.props?.theme);
  const payload = this.props.payload;
  if (!payload) return null;

  const themeColors = {
    active: bubbleTheme?.BUBBLE_RIGHT_BG_COLOR || 'blue',
    inactive: bubbleTheme?.BUBBLE_LEFT_BG_COLOR || 'gray',
  };

  let borderColor = this.props.onBottomSheetClose ? Color.transparent : bubbleTheme?.BUBBLE_LEFT_BG_COLOR
  return (
    <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'} style={[styles.main_Container, { width: window, borderColor: borderColor }]}>
      <Text style={[styles.label,{fontSize: 16, fontWeight: 'bold'}]}>{payload.title}</Text>
      <Text style={[styles.label,{fontSize: 14, marginTop:10, marginLeft: 5}]}>{payload.enterPinTitle}</Text>
      
      <PinInputGroup
        pinLength={payload.pinLength}
        value={this.state.otpValues1}
        onChange={(v: any) => this.setState({ otpValues1: v })}
        themeColors={themeColors}
      />

      <Text style={[styles.label,{fontSize: 14, marginTop:10, marginLeft: 5}]}>{payload.reEnterPinTitle}</Text>
      <PinInputGroup
        pinLength={payload.pinLength}
        value={this.state.otpValues2}
        onChange={(v: any) => this.setState({ otpValues2: v })}
        themeColors={themeColors}
      />

      { !this.state.isPinMatch && (
          <Text style={[styles.label, {fontSize: 14, alignSelf: 'center',marginBottom: 10, fontWeight: 'bold'}]}>{payload.warningMessage}</Text>
        )
      }

      <TouchableOpacity
        onPress={() => {
          const pin1 = this.state.otpValues1.join('');
          const pin2 = this.state.otpValues2.join('');
          this.setState({isPinMatch: pin1 === pin2 && pin1.length === payload.pinLength})
          if (pin1 === pin2 && pin1.length === payload.pinLength) {
            Keyboard.dismiss();
            if (this.props.onListItemClick){
              this.props.onListItemClick(payload.template_type, {
                title: '*'.repeat(pin1.length),
                payload: payload.piiReductionChar + pin1 + payload.piiReductionChar,
                type: 'postback',
              });
            }
            if (this.props.onBottomSheetClose) {
              this.props.onBottomSheetClose();
            }
          } 
        }}
        style={[styles.button, { backgroundColor: themeColors.active }]}
      >
        <Text style={{ color: bubbleTheme.BUBBLE_RIGHT_TEXT_COLOR || 'white',fontSize: 15,
                      fontWeight: '500'}}>
          {payload.resetButtons[0].title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
}

const styles = StyleSheet.create({
    main_Container:{
        marginTop: 0,
        marginEnd: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: Color.white,
        borderWidth: 1,
    },
    label:{
        color: Color.black,
        fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
        fontWeight: '400',
        letterSpacing: 0.2,
        fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    },
    textFeids_Container:{
        marginTop: 0,
        marginEnd: 10,
        padding: 5,
        backgroundColor: 'Transparent',
        flexDirection: 'row',
    },
    input: {
        height: 40,
        width: 40,
        textAlign: 'center',
        borderColor: Color.gray,
        borderWidth: 1,
        backgroundColor: Color.white,
        marginBottom: 10,
        borderRadius: 5,
        letterSpacing: 0.2,
        marginEnd: 10,
      },
      button:{
        marginTop:0,
        padding:10,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
      }
})