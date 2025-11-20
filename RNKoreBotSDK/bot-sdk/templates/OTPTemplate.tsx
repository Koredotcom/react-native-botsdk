import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Keyboard
} from 'react-native';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
import PinInputGroup from './PinInputGroup';
import { LocalizationManager } from '../constants/Localization';
import { normalize } from '../utils/helpers';
import { isIOS } from '../utils/PlatformCheck';
const windowWidth = Dimensions.get('window').width;
let width = windowWidth * 0.8 ;
import { placeholder } from '../assets';
interface OTPProps extends BaseViewProps {}
interface OTPState extends BaseViewState {
  inputText?: string;
  otpValues: any
}

const handleChange = (text: string, index: number) => {
};

export default class OTPTemplate extends BaseView<OTPProps, OTPState> {
      inputsRef: Array<any> = [];
      constructor(props: OTPProps) {
        super(props);
        this.state = {
          otpValues: Array(props?.payload?.pinLength || 4).fill(''),
          inputText: '',
        };
        this.inputsRef = [];
        
        if (this.props.onBottomSheetClose) {
          width = windowWidth * 0.90;
        }
      }

      private getLocalizedString = (key: string): string => {
        return LocalizationManager.getLocalizedString(key);
      };

      render() {
        const bubbleTheme = getBubbleTheme(this.props?.theme);
        const Wrapper: any = this.state.inputText ? TouchableOpacity : View;
        let payload = this.props.payload
        let borderColor = this.props.onBottomSheetClose ? Color.transparent : bubbleTheme.BUBBLE_LEFT_BG_COLOR;
        let padding = this.props.onBottomSheetClose ? 0 : 10;
        const themeColors = {
          active: bubbleTheme?.BUBBLE_RIGHT_BG_COLOR || 'blue',
          inactive: bubbleTheme?.BUBBLE_LEFT_BG_COLOR || 'gray',
        };
        return payload ? (
          <>
            <View 
            pointerEvents={this.isViewDisable() ? 'none' : 'auto'} 
            style={[styles.main_Container, { width: width, padding: padding, borderColor: borderColor}]}>
              
              <Text style={[styles.label, { fontSize: 16, fontWeight: 'bold' }]}>
                {payload.title}
              </Text>
      
              <Text style={[styles.label, { fontSize: 14, marginTop: 5 }]}>
                {payload.description}
              </Text>
      
              {/* Mobile Number */}
              <View style={[styles.mobileNo_Circle_Container, { backgroundColor: 'transparent', flexDirection: 'row', marginBottom: 10}]}>
                <View style={[styles.circle_Container, { backgroundColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR }]} />
                { <Image source={placeholder.mobile} style={[styles.image,{position: 'absolute',marginStart: 8,marginTop: 8}]}
                />}
                <Text style={[styles.label, { fontSize: 14, alignSelf: 'center', marginStart: 5 }]}>
                  {payload.mobileNumber}
                </Text>
              </View>
      
              {/* OTP Inputs */}
              <PinInputGroup
                pinLength={payload.pinLength}
                value={this.state.otpValues}
                onChange={(v: any) => this.setState({ otpValues: v })}
                themeColors={themeColors}
              />
              {/* Resend & Submit */}
              <View style={[styles.otpBtns_Container,{flexDirection: 'row', marginTop: 0}]}>
              <Text style={{ fontSize: 15, marginEnd: 4 }}>{this.getLocalizedString('did_not_get_code')}</Text>
                    <Text
                      style={{ 
                        fontSize: 15, 
                        textDecorationLine: 'underline', 
                        color: bubbleTheme.BUBBLE_RIGHT_BG_COLOR 
                      }}
                      onPress={() => {
                        console.log('Resend OTP clicked');
                        if (this.props.onListItemClick) {
                          this.props.onListItemClick(payload.template_type, {
                            title: payload.otpButtons[1].payload,
                            payload: payload.otpButtons[1].payload,
                            type: 'postback',
                          });
                        }
                        
                        if (this.props.onBottomSheetClose){
                          this.props.onBottomSheetClose()
                        }
                      }}
                    >
                      {payload.otpButtons[1].title}
                    </Text>
              </View>
              <TouchableOpacity
                  onPress={() => {
                    const pin1 = this.state.otpValues.join('');
                    if ((pin1.length || 0) == payload.pinLength) {
                      Keyboard.dismiss();
                      if (this.props.onListItemClick) {
                        this.props.onListItemClick(payload.template_type, {
                          title: '*'.repeat(pin1.length),
                          payload: payload.piiReductionChar + pin1 + payload.piiReductionChar,
                          type: 'postback',
                        });
                      }
                      if (this.props.onBottomSheetClose){
                        this.props.onBottomSheetClose()
                      }
                    }
                  }}
                  style={[
                    styles.button,
                    { backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR || Color.button_blue , marginBottom: isIOS ? 10 : 0},
                  ]}
                >
                  <Text
                    style={{
                      color: bubbleTheme.BUBBLE_RIGHT_TEXT_COLOR || Color.white,
                      fontSize: 15,
                      fontWeight: '500',
                    }}
                  >
                    {payload.otpButtons[0].title}
                  </Text>
                </TouchableOpacity>
            </View>
          </>
        ) : null;
      }
}

const styles = StyleSheet.create({
    main_Container:{
      marginTop: 0,
      marginEnd: 10,
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
    mobileNo_Circle_Container:{
      marginTop: 10
    },
    circle_Container:{
      width:30,
      height:30,
      borderRadius:15,
      backgroundColor: Color.red
    },
    image: {
      width: 15, // must set width
      height: 15, // must set height
      resizeMode: 'contain', // contain, cover, stretch, repeat, center
    },
    feilds_Container:{
      flexDirection: 'row',
      marginTop: 15
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
      marginEnd: normalize(10),
    },
    otpBtns_Container:{
      marginTop: 0
    },
    button: {
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
})
