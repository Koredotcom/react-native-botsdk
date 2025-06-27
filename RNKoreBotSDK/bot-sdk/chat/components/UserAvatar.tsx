import * as React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Color from '../../theme/Color';
import {normalize} from '../../utils/helpers';
import {isAndroid} from '../../utils/PlatformCheck';

const {
  carrot,
  emerald,
  peterRiver,
  wisteria,
  alizarin,
  turquoise,
  midnightBlue,
} = Color;

const styles = StyleSheet.create({
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarTransparent: {
    backgroundColor: Color.backgroundTransparent,
  },
  textStyle: {
    color: Color.white,
    fontSize: normalize(16),
    backgroundColor: Color.backgroundTransparent,
    fontWeight: '100',
  },
});

interface UserAvatarProps {
  user: {
    name?: string | null;
    avatar?: string | ((style: any) => React.ReactNode) | null;
  };
  onPress?: any;
  onLongPress?: () => void;
  avatarStyle?: any;
  textStyle?: any;

  color?: any;
  name?: any;
  size?: any;
  borderRadius?: any;
  style?: any;
  profileIcon?: any;
  userId?: any;
}

export default class UserAvatar extends React.Component<UserAvatarProps> {
  avatarName = '';
  avatarColor = '';

  static defaultProps = {
    user: {
      name: null,
      avatar: null,
    },
    onPress: null,
    onLongPress: null,
    avatarStyle: {},
    textStyle: {},
  };

  setAvatarColor() {
    const userName = (this.props.user && this.props.user.name) || '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }

    let sumChars = 0;
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i);
    }

    const colors = [
      carrot,
      emerald,
      peterRiver,
      wisteria,
      alizarin,
      turquoise,
      midnightBlue,
    ];

    this.avatarColor = colors[sumChars % colors.length];
  }

  renderAvatar() {
    const {user} = this.props;
    if (user) {
      if (typeof user.avatar === 'function') {
        return user.avatar([styles.avatarStyle, this.props.avatarStyle]);
      } else if (typeof user.avatar === 'string') {
        return (
          <FastImage
            source={{
              uri: user.avatar,
              priority: FastImage.priority.normal,
              cache: isAndroid
                ? FastImage.cacheControl.immutable
                : FastImage.cacheControl.web,
            }}
            style={[styles.avatarStyle, this.props.avatarStyle]}
          />
        );
      } else if (typeof user.avatar === 'number') {
        return (
          <FastImage
            source={{
              uri: user.avatar,
              priority: FastImage.priority.normal,
              cache: isAndroid
                ? FastImage.cacheControl.immutable
                : FastImage.cacheControl.web,
            }}
            style={[styles.avatarStyle, this.props.avatarStyle]}
          />
        );
      }
    }
    return null;
  }

  renderInitials() {
    return (
      <Text style={[styles.textStyle, this.props.textStyle]}>
        {this.avatarName}
      </Text>
    );
  }

  handleOnPress = () => {
    const {onPress, ...other} = this.props;
    if (onPress) {
      onPress(other);
    }
  };

  render() {
    if (
      !this.props.user ||
      (!this.props.user.name && !this.props.user.avatar)
    ) {
      // render placeholder
      return (
        <View
          style={[
            styles.avatarStyle,
            styles.avatarTransparent,
            this.props.avatarStyle,
          ]}
          accessibilityRole="image"
        />
      );
    }
    if (this.props.user.avatar) {
      return (
        <TouchableOpacity
          disabled={!this.props.onPress}
          onPress={this.props.onPress}
          onLongPress={this.props.onLongPress}
          accessibilityRole="image">
          {this.renderAvatar()}
        </TouchableOpacity>
      );
    } else {
      this.setAvatarColor();
      return (
        <TouchableOpacity
          disabled={!this.props.onPress}
          onPress={this.props.onPress}
          onLongPress={this.props.onLongPress}
          style={[
            styles.avatarStyle,
            {backgroundColor: this.avatarColor},
            this.props.avatarStyle,
          ]}
          accessibilityRole="image">
          {this.renderInitials()}
        </TouchableOpacity>
      );
    }
  }
}
