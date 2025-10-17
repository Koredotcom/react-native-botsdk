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
import Toast from "react-native-toast-message";
import {botStyles, TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
import * as FileSystem from "expo-file-system";
import { saveBase64File } from '../utils/Base64Converter'
import { BubbleTheme, TEMPLATE_TYPES } from '../constants/Constant';

const windowWidth = Dimensions.get('window').width;
let window = windowWidth * 0.8;

interface DigitalFormTemplateProps extends BaseViewProps {}
interface DigitalFormTemplateState extends BaseViewState {
}

export default class DigitalFormTemplate extends BaseView<DigitalFormTemplateProps, DigitalFormTemplateState> {
  intervalId: number | undefined;
  constructor(props: DigitalFormTemplate) {
    super(props);
    this.state = {isPlaying: false};
  }

  render() {
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    const payload = this.props.payload;
    if (!payload) return null;
  
    const themeColors = {
      active: bubbleTheme?.BUBBLE_RIGHT_BG_COLOR || 'blue',
      inactive: bubbleTheme?.BUBBLE_LEFT_BG_COLOR || 'gray',
    };

    let list = payload.buttons;
    if (!list || list.length === 0) {
      return <></>;
    }

    const bbtheme = getBubbleTheme(this.props?.theme);

    let borderColor = this.props.onBottomSheetClose ? Color.transparent : bubbleTheme?.BUBBLE_LEFT_BG_COLOR
    return (
    <View>
        <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'} style={[styles.main_Container, { width: window, borderColor: borderColor }]}>
            <Text style={[styles.label]}>{payload.text}</Text>
            <View style={{marginHorizontal: 10}}>
                {list.map((item: any, index: any) => {
                    return this.getSingleButtonView(
                        item,
                        index,
                        bbtheme,
                        payload);
                })}
            </View>
        </View>
        <Image source={require('../assets/placehoder/digitalForm.png')} style={[styles.image,{borderColor: borderColor, position: 'absolute',marginStart: 20}]}/>
      </View>
    );
  }

    private getSingleButtonView = (
        item: any,
        index = 0,
        bbtheme: BubbleTheme,
        payload: any
    ) => {
        return (
        <View key={index + ''} style={styles.item_container}>
            <TouchableOpacity
            key={index}
            style={[
                styles.btn_view,
                {
                    backgroundColor: Color.transparent,
                },
            ]}
            onPress={() => {
                if (this.props.onListItemClick) {
                this.props.onListItemClick(
                    TEMPLATE_TYPES.DIGITALFORM_TEMPLATE,
                    item,
                );
                }
            }}>
            <Text
                style={[
                styles.item_text,
                {
                    color: bbtheme.BUBBLE_RIGHT_BG_COLOR,
                    fontFamily: this.props?.theme?.v3?.body?.font?.family || 'Inter',
                },
                botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                    .size,
                ]}>
                {item.title}
            </Text>
            </TouchableOpacity>
        </View>
        );
    };
  }
  
  const styles = StyleSheet.create({
    main_Container:{
        marginTop: 30,
        marginEnd: 10,
        borderRadius: 5,
        backgroundColor: Color.white,
        borderWidth: 1,
    },
    label: {
        color: Color.black,
        fontWeight: '500',
        flexShrink: 1,
        flexWrap: 'wrap',
        letterSpacing: 0.2,
        fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
        fontSize: 14,
        marginTop: 40,
        marginHorizontal: 20,
    },
    button: {
        position: 'absolute',
        bottom: 5,
        right: 10,
        borderRadius: 5,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 60, 
        height: 60,
        padding: 15,
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: Color.white,
        resizeMode: 'contain', 
    },
    item_container: {
        flexWrap: 'wrap',
        marginBottom: 10,
        marginRight: 10,
        marginTop: 10,
    },
    btn_view: {
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        fontWeight: 'bold',
    },
    item_text: {
        fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
        alignSelf: 'center',
        color: Color.blue,
        fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
        fontWeight: 'normal',
    },
  })