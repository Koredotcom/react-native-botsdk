import * as React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import Communications from 'react-native-communications';

import {TEMPLATE_STYLE_VALUES, leftBubbleStyles} from '../theme/styles';

import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {ThemeContext} from '../theme/ThemeContext';
import {botStyles} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
import ParsedText from 'react-native-parsed-text';
import {getParseList} from '../utils/ParseList';

const WWW_URL_PATTERN = /^www\./i;

//const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];

export interface BotTextProps extends BaseViewProps {
  text?: string;
  optionTitles?: [];
  isFromViewMore?: boolean;
  isLastMsz?: boolean;
  isFilterApply?: boolean;
  text_color?: any;
}
export interface BotTextState extends BaseViewState {}

export default class BotText extends BaseView<BotTextProps, BotTextState> {
  static contextType = ThemeContext;
  // static contextTypes: {
  //   actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
  // };
  //static BotText: {};

  static defaultProps: {
    position: 'left';
    optionTitles: ['Call', 'Text', 'Cancel'];
    isFilterApply: false;
    text_color: undefined;
  };
  // shouldComponentUpdate(nextProps: any) {
  //   return (
  //     !!this.props.text &&
  //     !!nextProps.text &&
  //     this.props.text !== nextProps.text
  //   );
  // }

  onLinkCallback = (url: any) => {
    let isErrorResult = false;

    return new Promise<void>((resolve, reject) => {
      isErrorResult = this.onUrlPress(url);
      isErrorResult ? reject() : resolve();
    });
  };

  private onUrlPress = (url: string) => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          try {
            Linking.openURL(url);
          } catch (e) {}
          console.log('No handler for URL:', url);
        } else {
          Linking.openURL(url);
        }
      });
    }
    return true;
  };

  // private onPhonePress = (phone: string | null | undefined) => {
  //   const {optionTitles} = this.props;
  //   const options =
  //     optionTitles && optionTitles.length > 0
  //       ? optionTitles.slice(0, 3)
  //       : DEFAULT_OPTION_TITLES;
  //   const cancelButtonIndex = options.length - 1;
  //   // this.context.actionSheet().showActionSheetWithOptions(
  //   //   {
  //   //     options,
  //   //     cancelButtonIndex,
  //   //   },
  //   //   buttonIndex => {
  //   //     switch (buttonIndex) {
  //   //       case 0:
  //   //         Communications.phonecall(phone, true);
  //   //         break;
  //   //       case 1:
  //   //         Communications.text(phone);
  //   //         break;
  //   //       default:
  //   //         break;
  //   //     }
  //   //   },
  //   // );
  // };

  isViewDisable = () => {
    if (this.props.isFromViewMore) {
      return false;
    }

    return !this.props?.isLastMsz;
  };

  private onEmailPress = (email: string) =>
    Communications.email([email], null, null, null, null);
  render() {
    let text = this.props?.text;
    const bubbleTheme = getBubbleTheme(this.props?.theme);

    return text ? (
      <View style={{flexWrap: 'wrap', marginBottom: 5, marginEnd: 30}}>
        <View
          pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
          style={[
            styles.container,
            {
              backgroundColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR,
            },
            leftBubbleStyles[
              this.props?.theme?.v3?.body?.bubble_style || 'balloon'
            ].bubble_style,
          ]}>
          <ParsedText
            style={[
              styles.text,
              {
                color: bubbleTheme.BUBBLE_LEFT_TEXT_COLOR,
                fontFamily: this.props.theme?.v3?.body?.font?.family || 'Inter',
              },
              botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                ?.size,
              this.props.text_color && {
                color: this.props.text_color,
              },
            ]}
            parse={getParseList()}>
            {this.props.isFilterApply
              ? text.toString().replace(/\s\s+/g, '\n').trim()
              : text.trim()}
          </ParsedText>
        </View>
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#202124',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 10,
  },
  container: {
    padding: 5,
    //backgroundColor: 'red', //'#EFF0F0',
    // marginRight: 30,
    //flexWrap: 'wrap',
    marginLeft: 0,
    minHeight: 10,
    justifyContent: 'flex-start',
  },
});
