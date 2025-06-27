/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import Avatar, {AvatarProps} from './Avatar';
import Bubble from './Bubble';
import {isSameUser, normalize} from '../../utils/helpers';
import {Day} from './Day';
import {IThemeType} from '../../theme/IThemeType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BOT_ICON_URL} from '../../constants/Constant';
import Color from '../../theme/Color';

export interface MessageProps {
  renderAvatar?: (props: AvatarProps) => any | null;
  showUserAvatar?: boolean;

  renderDay?: (props: MessageProps) => any | null;
  position: 'left' | 'right' | 'center';
  currentMessage: any; // You may want to replace 'any' with a specific type
  nextMessage?: any; // You may want to replace 'any' with a specific type
  previousMessage?: any; // You may want to replace 'any' with a specific type
  user: any; // You may want to replace 'any' with a specific type
  inverted?: boolean;
  containerStyle?: {
    left?: any;
    right?: any;
    center?: any;
  };
  shouldUpdateMessage?: any;
  itemIndex?: any;
  isFirstMsz: boolean;
  key?: any;
  textStyle?: any;
  onListItemClick: any;
  onSendText: any;
  isDisplayTime: boolean;
  theme: IThemeType;
}

const styles = {
  bot_icon: {
    height: normalize(23),
    width: normalize(23),

    margin: 0,
  },
  bot_icon_con2: {
    height: normalize(23),
    width: normalize(23),
    borderRadius: 100,
  },
  bot_icon_con: {
    marginLeft: normalize(10),
  },
  image: {
    height: normalize(25),
    width: normalize(25),
    resizeMode: 'stretch',
    margin: 0,
  },
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  center: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'center',
      marginLeft: 0,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
};

export default class Message extends React.Component<MessageProps> {
  botIconUrl: any = null;
  static defaultProps = {
    renderAvatar: null,
    renderDay: null,
    position: 'left',
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
    showUserAvatar: false,
    inverted: true,
    shouldUpdateMessage: null,
    onListItemClick: () => {},
    onSendText: () => {},
  };
  // shouldComponentUpdate(nextProps: MessageProps): boolean {
  //   const next = nextProps.currentMessage;
  //   const current = this.props.currentMessage;
  //   const {previousMessage, nextMessage} = this.props;
  //   const nextPropsMessage = nextProps.nextMessage;
  //   const nextPropsPreviousMessage = nextProps.previousMessage;

  //   const shouldUpdate =
  //     (this.props.shouldUpdateMessage &&
  //       this.props.shouldUpdateMessage(this.props, nextProps)) ||
  //     false;

  //   return (
  //     next.sent !== current.sent ||
  //     next.received !== current.received ||
  //     next.pending !== current.pending ||
  //     next.createdOn !== current.createdOn ||
  //     next.text !== current.text ||
  //     next.image !== current.image ||
  //     next.video !== current.video ||
  //     next.audio !== current.audio ||
  //     previousMessage !== nextPropsPreviousMessage ||
  //     nextMessage !== nextPropsMessage ||
  //     shouldUpdate
  //   );
  // }

  renderDay(): any | null {
    if (this.props.currentMessage && this.props.currentMessage.createdOn) {
      const {containerStyle, ...props} = this.props;
      if (this.props.renderDay) {
        return this.props.renderDay(props);
      }
      return <Day {...props} />;
    }
    return null;
  }

  private renderBubble(): any | null {
    const {containerStyle, ...props} = this.props;
    const newProps = {
      ...props,
      onListItemClick: this.props.onListItemClick,
      onSendText: this.props.onSendText,
    };

    return <Bubble {...newProps} />;
  }

  private setBotIconUrl = async (url: any) => {
    if (this.botIconUrl !== url) {
      this.botIconUrl = url;
      AsyncStorage.setItem(BOT_ICON_URL, url);
    }
  };

  private renderAvatar(): any | undefined {
    const {user, currentMessage, showUserAvatar} = this.props;

    const isTimeTop =
      this.props.isDisplayTime &&
      this.props?.theme?.v3?.body?.time_stamp?.show &&
      this.props?.theme?.v3?.body?.time_stamp?.position === 'top';

    if (
      currentMessage?.type === 'bot_response' &&
      this.props?.theme?.v3?.body?.icon?.show
    ) {
      this.setBotIconUrl(currentMessage.icon);
      let name: any;
      const isShowBotIcon =
        this.props?.theme?.v3?.body?.icon?.bot_icon || false;

      if (!isShowBotIcon) {
        name =
          currentMessage?.botInfo?.chatBot?.[0]?.toUpperCase() || undefined;
      }
      return (
        <View
          style={[
            styles.bot_icon_con,

            isTimeTop && {marginTop: normalize(20)},
          ]}>
          <View
            style={[
              styles.bot_icon_con2,
              {
                backgroundColor: isShowBotIcon
                  ? Color.transparent
                  : this.props.theme?.v3?.general?.colors?.primary,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            {isShowBotIcon ? (
              <FastImage
                source={{
                  uri: currentMessage.icon,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable, // Use cache effectively
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={[styles.bot_icon, {alignSelf: 'center'}]}
              />
            ) : (
              name && (
                <Text
                  style={{
                    color: this.props.theme?.v3?.general?.colors?.secondary,
                    fontSize: normalize(14),
                  }}>
                  {name}
                </Text>
              )
            )}
          </View>
        </View>
      );
    }

    return <View style={{width: normalize(5)}} />;

    // try {
    //   console.log(
    //     'this.props currentMessage------>:',
    //     JSON.stringify(currentMessage),
    //   );
    // } catch (error) {}

    // if (
    //   currentMessage &&
    //   currentMessage.user &&
    //   user._id === currentMessage.user._id &&
    //   !showUserAvatar
    // ) {
    //   return null;
    // }

    // if (
    //   currentMessage &&
    //   currentMessage.user &&
    //   currentMessage.user.avatar === null
    // ) {
    //   return null;
    // }

    // const {...props} = this.props;

    //return <></>;
  }

  render() {
    const {currentMessage, nextMessage, position, containerStyle} = this.props;
    if (currentMessage) {
      const sameUser = isSameUser(currentMessage, nextMessage);
      const newPosition = position ? position : 'left';
      return (
        <View>
          <View style={{flexDirection: 'column'}}>
            {this.renderDay()}
            <View style={{flexDirection: 'row', marginBottom: normalize(5)}}>
              {this.renderAvatar()}
              <View
                style={[
                  styles[newPosition].container,
                  {marginBottom: sameUser ? 2 : 10},
                  !this.props.inverted && {marginBottom: 2},
                  containerStyle &&
                    containerStyle[position ? position : 'left'],
                  {flex: 1},
                  this.props?.theme?.v3?.body?.icon?.show &&
                    currentMessage?.type === 'bot_response' &&
                    position === 'left' && {
                      marginLeft: 0,
                    },
                  position === 'right' && {
                    marginRight: normalize(8),
                  },
                ]}>
                {/* {newPosition === 'left' ? this.renderAvatar() : null} */}
                {this.renderBubble()}

                {/* {newPosition === 'right' ? this.renderAvatar() : null} */}
              </View>
            </View>
            {/* {this.renderAvatar()} */}
          </View>
        </View>
      );
    }
    return <></>;
  }
}
