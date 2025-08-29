/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ToastAndroid,
  Platform,
  Animated,
} from 'react-native';

import MessageText from '../../templates/MessageText';

import Time from './Time';
import Color from '../../theme/Color';

import {
  normalize,
  isSameUser,
  isSameDay,
  getTemplateType,
} from '../../utils/helpers';
import {BotChatContext} from '../BotChatContext';
import {TEMPLATE_TYPES} from '../../constants/Constant';
import BotText from '../../templates/BotText';
import {ThemeType} from '../../theme/ThemeType';
import {ThemeContext} from '../../theme/ThemeContext';
import {IThemeType} from '../../theme/IThemeType';
import BotTemplate from '../../templates/BotTemplate';
import KoraBotClient from 'rn-kore-bot-socket-lib-v77';
import CustomTemplate from '../../templates/CustomTemplate';
import {isAndroid, isIOS} from '../../utils/PlatformCheck';

export interface BubbleProps {
  user: {
    _id: string;
    name: string;
  };
  touchableProps?: object;
  onLongPress?: (context: any, currentMessage: any) => void;
  renderMessageText?: (props: any) => React.ReactNode;
  renderCustomBubbles?: (props: any) => React.ReactNode;
  isCustomViewBottom?: boolean;
  renderUsernameOnMessage?: boolean;
  renderUsername?: (props: any) => React.ReactNode;
  renderTime?: (props: any) => React.ReactNode;
  renderTicks?: (currentMessage: any) => React.ReactNode;
  onQuickReply?: (replies: any) => void;
  position: 'left' | 'right' | 'center';
  optionTitles?: string[];
  currentMessage: {
    message?: any;
    pending: any;
    received: any;
    sent: any;
    text?: any;
    createdOn?: any | null;
    image?: any | null;
    user: {
      _id: string;
      name: string;
    };
    type?: any;
  };
  nextMessage?: any;
  previousMessage?: any;
  containerStyle?: {
    left?: string;
    right?: string;
    center?: string;
  };
  wrapperStyle?: {
    left?: string;
    right?: string;
    center?: string;
  };
  bottomContainerStyle?: {
    left?: string;
    right?: string;
    center?: string;
  };
  tickStyle?: any;
  usernameStyle?: any;
  containerToNextStyle?: {
    left?: string;
    right?: string;
    center?: string;
  };
  containerToPreviousStyle?: {
    left?: string;
    right?: string;
    center?: string;
  };
  textStyle?: any;
  onListItemClick: any;
  onSendText: any;

  isDisplayTime: boolean;
  templateInjection?: Map<string, CustomTemplate<any, any>>;
}

interface BubbleState {
  shakeAnim: Animated.Value;
  shakeInterpolate: Animated.AnimatedInterpolation<any>;
}

const DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel'];

export default class Bubble extends React.Component<BubbleProps, BubbleState> {
  static contextType = ThemeContext;
  protected actionSheet: any;
  static Bubble: {};

  constructor(props: BubbleProps) {
    super(props);
    // let {actionSheet} = useChatContext();
    this.actionSheet = BotChatContext;

    this.state = {
      shakeAnim: new Animated.Value(0), // Initial X position
      shakeInterpolate: new Animated.Value(0),
    };
  }

  static defaultProps: {
    currentMessage: null;
  };

  componentDidMount() {
    this.setState({
      shakeInterpolate: this.state.shakeAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -10, 0], // Adjust the values for intensity
      }),
    });
  }

  private getTextComponent = () => {
    let message: any =
      this.props.currentMessage?.message?.[0]?.component?.payload?.text;
    if (!message) {
      message = this.props.currentMessage?.message?.[0]?.component?.payload;
    }
    if (message?.payload && message?.payload?.text) {
      return message?.payload?.text;
    }
    if (typeof message === 'string') {
      return message;
    }

    return undefined;
  };

  private shake = () => {
    this.state.shakeAnim.setValue(0); // Reset animation to start
    Animated.sequence([
      Animated.timing(this.state.shakeAnim, {
        toValue: 1,
        duration: 500, // Duration of the shake
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.state.shakeAnim.setValue(0); // Reset after shake animation
    });
  };

  private onLongPress = (event: any, isRight?: boolean) => {
    if (!isRight) {
      return;
    }
    //let {currentMessage} = this.props;
    let textComponent = this.getTextComponent();
    console.log('---->: onLongPress clicked <----:');
    if (!textComponent) {
      return;
    }
    try {
      this.shake();
    } catch (error) {}

    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, textComponent);
    }
    if (isIOS) {
      // Toast.showWithGravity('Copied', Toast.SHORT, Toast.BOTTOM);
    } else {
      try {
        if (isAndroid) {
          const androidVersion = parseInt(Platform.Version as string, 10);
          if (androidVersion < 33) {
            ToastAndroid.showWithGravity(
              'Copied',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            ); // Custom toast
          }
        }
      } catch (error) {
        console.log('CustomClipboard Error -->:', error);
      }
    }
  };

  private styledBubbleToNext = () => {
    const {currentMessage, nextMessage, position, containerToNextStyle} =
      this.props;
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    ) {
      return [
        styles[position].containerToNext,
        containerToNextStyle && containerToNextStyle[position],
      ];
    }
    return null;
  };

  private styledBubbleToPrevious = () => {
    const {
      currentMessage,
      previousMessage,
      position,
      containerToPreviousStyle,
    } = this.props;
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    ) {
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ];
    }
    return null;
  };

  private renderBotText = (template_type?: string) => {
    let text = null;
    if (this.props.currentMessage && this.props.currentMessage.message) {
      // && !this.props.currentMessage.message?.type === 'onTaskUpdate') {

      let message = this.props.currentMessage.message[0];
      text = message?.component?.payload?.text;
      text = text ? text : message?.component?.payload?.payload?.text;
      text = text ? text : message?.component?.payload?.text?.text;
      if (template_type && template_type !== TEMPLATE_TYPES.QUICK_REPLIES) {
        text = text ? text : message?.component?.payload;
      }
    }
    if (text && typeof text === 'object') {
      let newText: {text: any} = text;
      text = newText?.text;
    }

    if (!text) {
      return null;
    }
    if (typeof text !== 'string') {
      console.log('⚠️  Bot text value is not a string type:', text);
      console.log('⚠️  Type of text:', typeof text);
      console.log('⚠️  Full message data:', JSON.stringify(this.props.currentMessage, null, 2));
      return <></>;
    }
    
    console.log('✅ Rendering bot text:', text);
    const theme = this.context as ThemeType;
    return (
      <BotText
        // {...this.props}
        //template_type={template_type}
        text={text}
        isFilterApply={true}
        theme={theme as IThemeType}
        //isLastMsz={isLastMsz}
      />
    );
  };

  private renderMessageText = () => {
    if (this.props.currentMessage) {
      const {containerStyle, wrapperStyle, optionTitles, ...messageTextProps} =
        this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }

      const theme = this.context as ThemeType;
      //return <Text>Text template</Text>;
      return <MessageText {...messageTextProps} theme={theme as IThemeType} />;
      //return this.renderBotText();
      //return this.renderBotText();
    }
    return null;
  };

  private renderTicks = () => {
    // const {currentMessage, renderTicks, user} = this.props;
    // if (renderTicks && currentMessage) {
    //   return renderTicks(currentMessage);
    // }
    // if (
    //   currentMessage &&
    //   user &&
    //   currentMessage.user &&
    //   currentMessage.user._id !== user._id
    // ) {
    //   return null;
    // }
    // if (
    //   currentMessage &&
    //   (currentMessage.sent || currentMessage.received || currentMessage.pending)
    // ) {
    //   return (
    //     <View style={styles.content.tickView}>
    //       {!!currentMessage.sent && (
    //         <Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>
    //       )}
    //       {!!currentMessage.received && (
    //         <Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>
    //       )}
    //       {!!currentMessage.pending && (
    //         <Text style={[styles.content.tick, this.props.tickStyle]}>🕓</Text>
    //       )}
    //     </View>
    //   );
    // }
    return null;
  };

  private renderBubbleViews = (
    templateType: string,
    payload: any,
    theme: IThemeType,
  ) => {
    const {containerStyle, wrapperStyle, optionTitles, ...messageTextProps} =
      this.props;
    return (
      <BotTemplate
        templateType={templateType}
        payload={payload}
        theme={theme}
        currentMessage={this.props.currentMessage}
        messageTextProps={messageTextProps}
        onListItemClick={this.props.onListItemClick}
        // textContainerStyle={
        //   {
        //     // backgroundColor: 'green',
        //   }
        // }
      />
    );
  };

  private checkIsLastMessage = () => {
    const {nextMessage} = this.props;
    if (this.isHiddenDialog(nextMessage)) {
      return true;
    }
    if (this.isEndOfTask(nextMessage)) {
      return true;
    }
    return !nextMessage || Object.keys(nextMessage).length === 0 ? true : false;
  };
  private isHiddenDialog = (data: any) => {
    if (
      data &&
      data.message &&
      data.message[0] &&
      data.message[0].component &&
      data.message[0].component.type === 'template' &&
      data.message[0].component.payload
    ) {
      let payload = data.message[0].component.payload;

      if (payload.payload && payload.payload.template_type) {
        if (TEMPLATE_TYPES.HIDDEN_DIALOG === payload.payload.template_type) {
          return true;
        }
      }
    }

    return false;
  };

  private isEndOfTask = (data: any) => {
    if (
      data &&
      data.message &&
      data.message[0] &&
      data.message[0].component &&
      data.message[0].component.payload
    ) {
      let payload = data.message[0].component.payload;

      if (payload && payload.endOfTask) {
        return true;
      }
    }

    return false;
  };
  private getPayload = (type?: string) => {
    let payloadProps = {};
    if (
      type === TEMPLATE_TYPES.TEXT ||
      type === TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE
    ) {
      payloadProps = this.props?.currentMessage?.message?.[0]?.component;
    } else {
      payloadProps =
        this.props?.currentMessage?.message?.[0]?.component?.payload?.payload;
    }

    if (!payloadProps) {
      return {};
    }
    return {
      ...payloadProps,
      onListItemClick: this.props.onListItemClick,
      isLastMessage: this.checkIsLastMessage(),
    };
  };
  private renderBubbleContent = () => {
    let templateType = getTemplateType(this.props.currentMessage?.message);
    //console.log('templateType --->:', templateType);
    const theme = this.context as IThemeType;
    let payload: any = this.getPayload(templateType);

    //For custom template
    if (this.props?.templateInjection) {
      let templateInjection: Map<string, any> = this.props?.templateInjection;

      let CustomView = templateInjection?.get?.(templateType);

      if (CustomView) {
        try {
          return (
            <CustomView
              payload={payload}
              onListItemClick={this.props.onListItemClick}
              isLastMessage={this.checkIsLastMessage()}
            />
          );
        } catch (error) {
          console.log('templateType :', templateType);
          console.log('CustomView  error:', error);
        }
      }
    }

    return (
      <View style={{marginTop: normalize(0)}}>
        {this.renderBubbleViews(templateType, payload, theme)}
      </View>
    );
  };
  protected renderUsername = () => {
    return null;
    // const {currentMessage, user} = this.props;
    // if (this.props.renderUsernameOnMessage && currentMessage) {
    //   if (user && currentMessage.user._id === user._id) {
    //     return null;
    //   }
    //   return (
    //     <View style={styles.content.usernameView}>
    //       <Text style={[styles.content.username, this.props.usernameStyle]}>
    //         ~ {currentMessage.user.name}
    //       </Text>
    //     </View>
    //   );
    // }
    // return null;
  };
  private renderTime = () => {
    let createdOn: any =
      this.props.currentMessage?.createdOn ||
      this.props.currentMessage.message?.[0]?.component?.payload?.createdOn;
    if (createdOn) {
      const {containerStyle, wrapperStyle, textStyle, ...timeProps} =
        this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      const theme = this.context as ThemeType;

      const isUserMessage = this.props.currentMessage?.type === 'user_message';

      return (
        <View style={{flexDirection: 'row'}}>
          {isUserMessage && (
            <Time
              createdOn={createdOn}
              {...timeProps}
              theme={theme as IThemeType}
            />
          )}
          <Text
            style={[
              {
                fontSize: normalize(10),
                textAlign: 'center',
                opacity: 0.8,
                marginStart: 5,
              },
              isUserMessage && {
                marginEnd: 10,
              },
              {
                color: theme?.v3?.body?.time_stamp?.color || '#1d2939',
                fontFamily: theme?.v3?.body?.font?.family || 'Inter',
                opacity: 1,
              },
              {
                fontWeight: '700',
                alignSelf:'center',
                fontSize: normalize(10),
              },
            ]}>
            {isUserMessage ? 'You' : KoraBotClient.getInstance().getBotName()}
          </Text>
          {!isUserMessage && (
            <Time
              createdOn={createdOn}
              {...timeProps}
              theme={theme as IThemeType}
            />
          )}
        </View>
      );
    }
    return <></>;
  };

  render() {
    const {position, containerStyle, wrapperStyle, bottomContainerStyle} =
      this.props;
    const theme = this.context as ThemeType;
    return (
      <View
        style={[
          styles[position].container,
          containerStyle && containerStyle[position],
        ]}>
        {theme?.v3?.body?.time_stamp?.show &&
          theme?.v3?.body?.time_stamp?.position === 'top' &&
          this.renderTime()}

        <View
          style={[
            styles[position].wrapper,
            this.styledBubbleToNext(),
            this.styledBubbleToPrevious(),
            wrapperStyle && wrapperStyle[position],
            theme?.v3?.body?.icon?.show &&
              position === 'left' && {marginLeft: 5},
          ]}>
          <TouchableWithoutFeedback
            onLongPress={(event: any) =>
              this.onLongPress(event, position === 'right')
            }
            accessibilityRole="text"
            {...this.props.touchableProps}>
            <Animated.View
              style={[
                {transform: [{translateX: this.state.shakeInterpolate}]},
              ]}>
              {this.renderBubbleContent()}
              <View
                style={[
                  styles[position].bottom,
                  bottomContainerStyle && bottomContainerStyle[position],
                ]}>
                {this.renderUsername()}

                {this.renderTicks()}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
        {theme?.v3?.body?.time_stamp?.show &&
          theme?.v3?.body?.time_stamp?.position === 'bottom' &&
          this.renderTime()}
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      marginLeft: 8,
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      marginRight: normalize(5),
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  }),
  content: StyleSheet.create({
    tick: {
      fontSize: normalize(10),
      backgroundColor: Color.backgroundTransparent,
      color: Color.black,
    },
    tickView: {
      flexDirection: 'row',
      marginRight: 10,
    },
    username: {
      top: -3,
      left: 0,
      fontSize: normalize(12),
      backgroundColor: 'transparent',
      color: '#aaa',
    },
    usernameView: {
      flexDirection: 'row',
      marginHorizontal: 10,
    },
  }),
  center: StyleSheet.create({
    containerToNext: {},
    containerToPrevious: {},
    container: {},
    wrapper: {},
    bottom: {},
  }),
};

Bubble.defaultProps = {
  currentMessage: null,
};
