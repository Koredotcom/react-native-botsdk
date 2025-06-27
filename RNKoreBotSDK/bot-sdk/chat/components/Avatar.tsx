import React, {Component} from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import UserAvatar from './UserAvatar';
import {isSameUser, isSameDay, normalize} from '../../utils/helpers';

export interface AvatarProps {
  renderAvatarOnTop?: boolean;
  showAvatarForEveryMessage?: boolean;
  position: 'left' | 'right' | 'center';
  currentMessage?: {user: any};
  previousMessage?: any;
  nextMessage?: any;
  onPressAvatar: (user: any) => void;
  onLongPressAvatar: (user: any) => void;
  //renderAvatar: (props: AvatarProps) => React.ReactNode;
  renderAvatar?: (props: any) => React.ReactNode;
  containerStyle?: {
    left?: StyleProp<ViewStyle>;
    right?: StyleProp<ViewStyle>;
    center?: StyleProp<ViewStyle>;
  };
  imageStyle?: {
    left?: StyleProp<ViewStyle>;
    right?: StyleProp<ViewStyle>;
    center?: StyleProp<ViewStyle>;
  };
  textStyle?: StyleProp<ViewStyle>;
}

export default class Avatar extends Component<AvatarProps> {
  constructor(props: AvatarProps) {
    super(props);
  }
  static defaultProps = {
    renderAvatarOnTop: false,
    showAvatarForEveryMessage: false,
    position: 'left',
    currentMessage: {
      user: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    imageStyle: {},
    onPressAvatar: () => {},
    onLongPressAvatar: () => {},
  };

  onLongPress = () => {
    this.props.onLongPressAvatar &&
      this.props.onLongPressAvatar(this.props.currentMessage?.user);
  };

  renderAvatar() {
    if (this.props.renderAvatar) {
      const {...avatarProps} = this.props;
      return this.props.renderAvatar(avatarProps);
    }
    if (this.props.currentMessage) {
      return (
        <UserAvatar
          avatarStyle={[
            styles[this.props.position!].image,
            this.props.imageStyle &&
              this.props.imageStyle[this.props.position!],
          ]}
          textStyle={this.props.textStyle ? this.props.textStyle : {}}
          user={this.props.currentMessage.user}
          onPress={() =>
            this.props.onPressAvatar &&
            this.props.onPressAvatar(this.props.currentMessage?.user)
          }
          onLongPress={this.onLongPress}
        />
      );
    }
    return null;
  }

  render() {
    const {
      renderAvatarOnTop,
      showAvatarForEveryMessage,
      containerStyle,
      position,
      currentMessage,
      renderAvatar,
      previousMessage,
      nextMessage,
      imageStyle,
    } = this.props;
    const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
    const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';

    if (renderAvatar === null) {
      return null;
    }

    if (
      !showAvatarForEveryMessage &&
      currentMessage &&
      messageToCompare &&
      isSameUser(currentMessage, messageToCompare) &&
      isSameDay(currentMessage, messageToCompare)
    ) {
      return (
        <View
          style={[
            styles[position!].container,
            containerStyle && containerStyle[position!],
          ]}>
          <UserAvatar
            avatarStyle={[
              styles[position!].image,
              imageStyle && imageStyle[position!],
            ]}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles[position!].container,
          styles[position!][computedStyle],
          containerStyle && containerStyle[position!],
        ]}>
        {this.renderAvatar()}
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: normalize(23),
      width: normalize(23),
      borderRadius: 18,
    },
  }),
  center: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: normalize(23),
      width: normalize(23),
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: normalize(23),
      width: normalize(23),
      borderRadius: 18,
    },
  }),
};
