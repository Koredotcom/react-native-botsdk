import * as React from 'react';
import {
  Linking,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import { FallbackCommunicationsAPI } from '../components/LazyCommunications';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  TEMPLATE_STYLE_VALUES,
  botStyles,
  leftBubbleStyles,
  rightBubbleStyles,
} from '../theme/styles';
import Color from '../theme/Color';
import {ThemeContext} from '../theme/ThemeContext';
import {getBubbleTheme} from '../theme/themeHelper';
import {getParseList} from '../utils/ParseList';

interface MessageTextProps extends BaseViewProps {
  optionTitles?: string[];
  containerStyle?: any;
  template_type?: any;

  textStyle?: {
    left?: any;
    right?: any;
    center?: any;
  };
  linkStyle?: {
    left?: any;
    right?: any;
    center?: any;
  };
  parsePatterns: (arg: any) => [];
  textProps?: Record<string, any>;
  customTextStyle?: StyleProp<TextStyle>;
}

interface MessageTextState extends BaseViewState {}

const WWW_URL_PATTERN = /^www\./i;

const textStyle: TextStyle = {
  fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
  // lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 30,
      minHeight: 20,
      justifyContent: 'flex-end',
      paddingBottom: 5,
      paddingTop: 5,
    } as ViewStyle,
    text: {
      color: Color.black,
      ...textStyle,
    } as TextStyle,
    link: {
      color: Color.black,
      textDecorationLine: 'underline',
    } as TextStyle,
  }),
  center: StyleSheet.create({
    container: {} as ViewStyle,
    text: {
      color: Color.white,
      ...textStyle,
    } as TextStyle,
    link: {
      color: Color.white,
      textDecorationLine: 'underline',
    } as TextStyle,
  }),
  right: StyleSheet.create({
    container: {
      //backgroundColor: Color.defaultBlue,
      marginLeft: 30,
      minHeight: 20,
      minWidth: 40,
      justifyContent: 'flex-end',
      paddingBottom: 5,
      paddingTop: 5,
    },
    text: {
      color: Color.white,
      ...textStyle,
      alignSelf: 'center',
    } as TextStyle,
    link: {
      color: Color.white,
      textDecorationLine: 'underline',
    } as TextStyle,
  }),
};

//const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];

class MessageText extends BaseView<MessageTextProps, MessageTextState> {
  //private actionSheet?: any;
  static contextType = ThemeContext;
  static propTypes: {
    containerStyle: any;
    textStyle: any;
    linkStyle: any;

    parsePatterns: any;
    textProps: any;
    customTextStyle: any;
    payload: any;
    template_type?: any;
  };

  constructor(props: MessageTextProps) {
    super(props);
    //let {actionSheet} = useChatContext();
    // this.actionSheet = BotChatContext;
  }

  static defaultProps: {
    position: 'left';
    optionTitles: ['Call', 'Text', 'Cancel'];

    containerStyle: undefined;
    textStyle: {};
    linkStyle: {};
    customTextStyle: {};
    textProps: {};
    parsePatterns: () => [];
    payload: undefined;
    template_type: undefined;
  };

  onUrlPress = (url: string) => {
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('No handler for URL:', url);
          try {
            Linking.openURL(url);
          } catch (e) {}
        } else {
          Linking.openURL(url);
        }
      });
    }
  };

  onPhonePress = (_phone: string) => {
    // const {optionTitles} = this.props;
    // const options =
    //   optionTitles && optionTitles.length > 0
    //     ? optionTitles.slice(0, 3)
    //     : DEFAULT_OPTION_TITLES;
    // const cancelButtonIndex = options.length - 1;
    //Communications.phonecall(phone, false);
    // this.actionSheet?.().showActionSheetWithOptions(
    //   {
    //     options,
    //     cancelButtonIndex,
    //   },
    //   (buttonIndex: any) => {
    //     switch (buttonIndex) {
    //       case 0:
    //         Communications.phonecall(phone, true);
    //         break;
    //       case 1:
    //         Communications.text(phone);
    //         break;
    //       default:
    //         break;
    //     }
    //   },
    // );
  };

  onEmailPress = async (email: string) => {
    try {
      // Try to dynamically load react-native-communications
      const communications = await this.loadCommunications();
      if (communications) {
        communications.email([email], null, null, null, null);
      } else {
        // Fallback to basic Linking API
        FallbackCommunicationsAPI.email([email], null, null, null, null);
      }
    } catch (error) {
      console.warn('Failed to load communications, using fallback:', error);
      // Fallback to basic Linking API
      FallbackCommunicationsAPI.email([email], null, null, null, null);
    }
  };

  private async loadCommunications() {
    try {
      const CommunicationsModule = await import('react-native-communications');
      return CommunicationsModule.default || CommunicationsModule;
    } catch (error) {
      console.warn('react-native-communications not available:', error);
      return null;
    }
  }

  parseTextWithIcons = (text: string) => {
    const entityRegex = /&#(\d+);/g;
    const parsedText = text?.replace(entityRegex, (match, decimal) =>
      String.fromCodePoint(decimal),
    );
    return parsedText;
  };

  render() {
    //console.log('this.props.position --->:', this.props.position);
    const linkStyle = [
      styles[this.props.position!]?.link,
      this.props.linkStyle && this.props.linkStyle[this.props.position!],
    ];

    const payload: any = this.props?.payload?.payload || this.props?.payload;

    // if (payload) {
    //   console.log('this.props.payload --->:', JSON.stringify(payload));
    // }
    let message: any = payload?.text;
    if (!message && typeof message !== 'string') {
      message = payload?.payload?.text;
    }

    if (!message && typeof message !== 'string') {
      try {
        if (
          payload?.lastMessage?.messagePayload?.message?.attachments?.[0]
            ?.isFromLocal &&
          payload?.lastMessage?.messagePayload?.message?.attachments?.[0]
            ?.fileId
        ) {
          message = JSON.stringify(
            payload?.lastMessage?.messagePayload?.message?.attachments?.[0],
          );
        } else {
          try {
            message = JSON.stringify(payload); //payload?.toString?.();
            
          } catch (error) {
            message = payload;
          }
          
        }
      } catch (error) {
        message = payload; //payload?.toString?.();
      }
    }

    // console.log('📄 MessageText - Processing payload:', JSON.stringify(payload, null, 2));
    // console.log('📄 MessageText - Extracted message:', message);

    let text: string | undefined = message;
    // console.log('========================');
    // console.log(
    //   'this.props?.theme?.v3?.body?.bubble_style ---->:',
    //   this.props?.theme?.v3?.body?.bubble_style,
    // );
    // console.log('========================');
    let parseList: any = [];
    if (this.props.parsePatterns && this.props.parsePatterns(linkStyle)) {
      parseList = {...this.props.parsePatterns(linkStyle)};
    }
    const position = this.props.position ? this.props.position : 'left';

    const bubbleTheme = getBubbleTheme(this.props?.theme);

    const isPassword = this.checkIsPassword(text);

    return text ? (
      <View
        style={
          this.props.containerStyle
            ? this.props.containerStyle
            : [
                styles[position]?.container,

                position === 'left' && {
                  backgroundColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR,
                  ...leftBubbleStyles[
                    this.props?.theme?.v3?.body?.bubble_style || 'balloon'
                  ].bubble_style,
                },
                position === 'right' && {
                  backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR,
                  ...rightBubbleStyles[
                    this.props?.theme?.v3?.body?.bubble_style || 'balloon'
                  ].bubble_style,
                },
              ]
        }>
        <ParsedText
          style={[
            styles[position!]?.text,
            this.props.textStyle && this.props.textStyle[position!],
            this.props.customTextStyle,

            {
              fontFamily: this.props?.theme?.v3?.body?.font?.family,
              color:
                this.props?.theme?.v3?.general?.colors?.primary_text ||
                '#ffffff',
            },
            botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
              ?.size,

            position === 'left' && {
              color: bubbleTheme.BUBBLE_LEFT_TEXT_COLOR,
            },
            position === 'right' && {
              color: bubbleTheme.BUBBLE_RIGHT_TEXT_COLOR,
            },
          ]}
          parse={isPassword ? [] : [...parseList, ...getParseList()]}
          childrenProps={{...this.props.textProps}}>
          {this.parseTextWithIcons(text?.trim?.())?.trim()}
        </ParsedText>
      </View>
    ) : (
      <View />
    );
  }
  private checkIsPassword(text: string | undefined) {
    if (!text || text?.trim?.().length === 0) {
      return false;
    }

    const code = text?.trim?.();
    if (!code || code?.trim?.().length === 0) {
      return false;
    }

    for (let i = 0; i < code.length; i++) {
      if (code[i] !== '*') {
        return false;
      }
    }

    return true;
  }
}

export default MessageText;
