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
import { LocalizationManager } from '../constants/Localization';
import { normalize } from '../utils/helpers';
import { isIOS } from '../utils/PlatformCheck';
const windowWidth = Dimensions.get('window').width;
let width = windowWidth * 0.8 ;

interface OTPProps extends BaseViewProps {}
interface OTPState extends BaseViewState {
  inputText?: string;
  otpValues: any,
  focusedIndex: number
}

const handleChange = (text: string, index: number) => {
};

export default class OTPTemplate extends BaseView<OTPProps, OTPState> {
      inputsRef: Array<any> = [];
      constructor(props: OTPProps) {
        super(props);
        this.state = {
          otpValues: Array(props?.payload?.pinLength || 4).fill(''),
          focusedIndex: -1,  // -1 means no input is focused initially
        };
        this.inputsRef = [];
        
        if (this.props.onBottomSheetClose) {
          width = windowWidth * 0.90;
        }
      }

      private getLocalizedString = (key: string): string => {
        return LocalizationManager.getLocalizedString(key);
      };
      
      handleChange = (text: any, index: number) => {
        const newOtp = [...this.state.otpValues];
        newOtp[index] = text;
      
        this.setState({ otpValues: newOtp, inputText: newOtp.join('') });
      
        if (text.length > 0 && index < this.inputsRef.length - 1) {
          this.inputsRef[index + 1]?.focus();
        }
      };
      
      handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && this.state.otpValues[index] === '' && index > 0) {
          this.inputsRef[index - 1]?.focus();
        }
      };
      
      handleFocus = (index: number) => {
        this.setState({ focusedIndex: index });
      };
      
      handleBlur = () => {
        this.setState({ focusedIndex: -1 });
      };
      
      render() {
        const bubbleTheme = getBubbleTheme(this.props?.theme);
        const Wrapper: any = this.state.inputText ? TouchableOpacity : View;
        let payload = this.props.payload
        let borderColor = this.props.onBottomSheetClose ? Color.transparent : bubbleTheme.BUBBLE_LEFT_BG_COLOR;
        let padding = this.props.onBottomSheetClose ? 0 : 10;
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
              <View style={[styles.mobileNo_Circle_Container, { backgroundColor: 'transparent', flexDirection: 'row' }]}>
                <View style={[styles.circle_Container, { backgroundColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR }]} />
                { <Image source={require('../assets/placehoder/mobile.png')} style={[styles.image,{position: 'absolute',marginStart: 8,marginTop: 8}]}
                />}
                <Text style={[styles.label, { fontSize: 14, alignSelf: 'center', marginStart: 5 }]}>
                  {payload.mobileNumber}
                </Text>
              </View>
      
              {/* OTP Inputs */}
              <View style={styles.feilds_Container}>
                {Array.from({ length: payload.pinLength }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (this.inputsRef[index] = ref)}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          this.state.focusedIndex === index
                            ? bubbleTheme?.BUBBLE_RIGHT_BG_COLOR || 'blue' // highlight color when focused
                            : bubbleTheme?.BUBBLE_LEFT_BG_COLOR || 'gray', // default border color
                      },
                    ]}
                    placeholder="0"
                    placeholderTextColor="#e4e5eb"
                    keyboardType="numeric"
                    maxLength={1}
                    value={this.state.otpValues[index]}
                    onChangeText={(text) => this.handleChange(text, index)}
                    onKeyPress={(e) => this.handleKeyPress(e, index)}
                    onFocus={() => this.handleFocus(index)}
                    onBlur={this.handleBlur}
                  />
                ))}
              </View>
              {/* Resend & Submit */}
              <View style={[styles.otpBtns_Container,{flexDirection: 'row', marginTop: 5}]}>
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
                    //console.log('submit btn clicked', this.state.inputText);
                    const title = '*'.repeat(this.state.inputText?.length || 0);
                    const length = this.state?.inputText?.length || 0;
                    if ((this.state?.inputText?.length || 0) == payload.pinLength) {
                      Keyboard.dismiss();
                      if (this.props.onListItemClick) {
                        this.props.onListItemClick(payload.template_type, {
                          title,
                          payload: this.state.inputText,
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
                    { backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR || Color.button_blue , marginBottom: isIOS ? 15 : 0},
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
      marginTop: 15
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