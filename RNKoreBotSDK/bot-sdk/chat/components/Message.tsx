/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import Avatar, { AvatarProps } from './Avatar';
import Bubble from './Bubble';
import { isSameUser, normalize } from '../../utils/helpers';
import { Day } from './Day';
import { IThemeType } from '../../theme/IThemeType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOT_ICON_URL } from '../../constants/Constant';
import Color from '../../theme/Color';
import { placeholder } from '../../assets';

const TIMESTAMP_ROW_OFFSET = normalize(25);
const TIMESTAMP_OFFSET_TRIM = normalize(7);

const effectiveTimestampAvatarOffset = () =>
  Math.max(0, TIMESTAMP_ROW_OFFSET - TIMESTAMP_OFFSET_TRIM);

const effectiveTimestampAvatarOffsetWhenTsBelow = () => TIMESTAMP_ROW_OFFSET;

const AVATAR_MARGIN_BOTTOM_TS_TOP_ICON_BOTTOM = normalize(6);

export interface MessageProps {
  renderAvatar?: (props: AvatarProps) => any | null;
  showUserAvatar?: boolean;
  renderAvatarOnTop?: boolean;
  showAvatarForEveryMessage?: boolean;
  onPressAvatar?: (user: any) => void;
  onLongPressAvatar?: (user: any) => void;

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
  fallbackBotIcon?: string | null;
  showSendAgain?: boolean;
  onSendAgain?: () => void;
  onDeleteFailedMessage?: () => void;
}

const styles = {
  bot_icon: {
    height: normalize(23),
    width: normalize(23),
    marginTop: 0,
  },
  bot_icon_con2: {
    height: normalize(23),
    width: normalize(23),
    borderRadius: 100,
  },
  bot_icon_con: {
    marginLeft: normalize(10),
    marginEnd: normalize(-2),
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
  state = {
    imageLoadFailed: false,
  };

  static defaultProps = {
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
    renderAvatarOnTop: true,
    showAvatarForEveryMessage: false,
    onPressAvatar: () => {},
    onLongPressAvatar: () => {},
  };

  private resolveRenderAvatarOnTop = (): boolean => {
    const themePos = this.props.theme?.v3?.body?.icon?.avatar_position;
    if (themePos === 'top') {
      return true;
    }
    if (themePos === 'bottom') {
      return false;
    }
    return this.props.renderAvatarOnTop ?? true;
  };

  private getTimestampAvatarOffset = (): ViewStyle => {
    const { theme, isDisplayTime } = this.props;
    const ts = theme?.v3?.body?.time_stamp;
    if (!ts?.show || !isDisplayTime) {
      return {};
    }
    const pos = ts.position ?? 'bottom';
    const offsetTopCase = effectiveTimestampAvatarOffset();
    const offsetTsBelowBubble = effectiveTimestampAvatarOffsetWhenTsBelow();
    const iconBottom = !this.resolveRenderAvatarOnTop();

    if (pos === 'top') {
      const style: ViewStyle = { marginTop: offsetTopCase };
      if (iconBottom) {
        style.marginBottom = AVATAR_MARGIN_BOTTOM_TS_TOP_ICON_BOTTOM;
      }
      return style;
    }
    if (pos === 'bottom') {
      return { marginBottom: offsetTsBelowBubble };
    }
    return {};
  };

  private setBotIconUrl = async (url: any) => {
    if (this.botIconUrl !== url) {
      this.botIconUrl = url;
      this.setState({ imageLoadFailed: false });
      AsyncStorage.setItem(BOT_ICON_URL, url);
    }
  };

  private renderDefaultBotAvatar = (avatarProps: AvatarProps) => {
    const currentMessage =
      avatarProps.currentMessage || this.props.currentMessage;
    const iconUrl = currentMessage?.icon || this.props.fallbackBotIcon || null;

    if (iconUrl) {
      this.setBotIconUrl(iconUrl);
    }

    return (
      <View
        style={[
          styles.bot_icon_con2,
          {
            backgroundColor: Color.transparent,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <FastImage
          source={
            this.state.imageLoadFailed || !iconUrl
              ? placeholder.default_bot_icon
              : {
                  uri: iconUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }
          }
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.bot_icon, { alignSelf: 'center' }]}
          onError={() => {
            this.setState({ imageLoadFailed: true });
          }}
        />
      </View>
    );
  };

  private renderBotAvatarSlot(): React.ReactNode {
    const { currentMessage, theme, position } = this.props;

    if (
      currentMessage?.type !== 'bot_response' ||
      !theme?.v3?.body?.icon?.show
    ) {
      return <View style={{ width: normalize(5) }} />;
    }

    if (!theme?.v3?.body?.icon?.bot_icon) {
      return <View style={{ width: normalize(5) }} />;
    }

    const newPosition = position ? position : 'left';
    const customRender = this.props.renderAvatar;
    const renderFn =
      customRender != null ? customRender : this.renderDefaultBotAvatar;

    const containerOffset = this.getTimestampAvatarOffset();

    return (
      <Avatar
        renderAvatar={renderFn}
        renderAvatarOnTop={this.resolveRenderAvatarOnTop()}
        showAvatarForEveryMessage={this.props.showAvatarForEveryMessage}
        position={newPosition}
        currentMessage={currentMessage}
        previousMessage={this.props.previousMessage}
        nextMessage={this.props.nextMessage}
        onPressAvatar={this.props.onPressAvatar!}
        onLongPressAvatar={this.props.onLongPressAvatar!}
        containerStyle={{
          [newPosition]: [styles.bot_icon_con, containerOffset],
        }}
      />
    );
  }

  renderDay(): any | null {
    if (this.props.currentMessage && this.props.currentMessage.createdOn) {
      const { containerStyle, ...props } = this.props;
      if (this.props.renderDay) {
        return this.props.renderDay(props);
      }
      return <Day {...props} />;
    }
    return null;
  }

  private renderBubble(): any | null {
    const { containerStyle, ...props } = this.props;
    const newProps = {
      ...props,
      onListItemClick: this.props.onListItemClick,
      onSendText: this.props.onSendText,
      showSendAgain: this.props.showSendAgain,
      onSendAgain: this.props.onSendAgain,
      onDeleteFailedMessage: this.props.onDeleteFailedMessage,
    };

    return <Bubble {...newProps} />;
  }

  render() {
    const { currentMessage, nextMessage, position, containerStyle } =
      this.props;
    if (currentMessage) {
      const sameUser = isSameUser(currentMessage, nextMessage);
      const newPosition = position ? position : 'left';
      return (
        <View>
          <View style={{ flexDirection: 'column' }}>
            {this.renderDay()}
            <View style={{ flexDirection: 'row', marginBottom: normalize(5) }}>
              {this.renderBotAvatarSlot()}
              <View
                style={[
                  styles[newPosition].container,
                  { marginBottom: sameUser ? 2 : 10 },
                  !this.props.inverted && { marginBottom: 2 },
                  containerStyle &&
                    containerStyle[position ? position : 'left'],
                  { flex: 1 },
                  this.props?.theme?.v3?.body?.icon?.show &&
                    currentMessage?.type === 'bot_response' &&
                    position === 'left' && {
                      marginLeft: 0,
                    },
                  position === 'right' && {
                    marginRight: normalize(8),
                  },
                ]}
              >
                {this.renderBubble()}
              </View>
            </View>
          </View>
        </View>
      );
    }
    return <></>;
  }
}
