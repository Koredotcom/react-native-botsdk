import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Color from '../../theme/Color';
import {normalize} from '../../utils/helpers';

interface SendProps extends ViewProps {
  text?: string;
  onSend?: (data: {text?: string}, boolean: boolean) => void;
  label?: string;
  textStyle?: any;
  children?: any;
  alwaysShowSend?: boolean;
  disabled?: boolean;
  sendButtonProps?: object;
  isMediaAddedToSend?: boolean;
}

const styles = StyleSheet.create({
  container: {
    width: normalize(38),
    height: normalize(38),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: normalize(17),
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 15,
  },
});

export default class Send extends Component<SendProps> {
  static defaultProps: {
    text: string;
    onSend: any;
    label: string;
    containerStyle: {};
    textStyle: {};
    children: null;
    alwaysShowSend: boolean;
    disabled: boolean;
    sendButtonProps: null;
  };
  constructor(props: SendProps) {
    super(props);
  }

  handleOnPress = (): void => {
    const {text, onSend} = this.props;
    if (text && text?.trim?.()?.length > 0) {
      onSend?.({text: text.trim()}, true);
    } else if (this.props.isMediaAddedToSend) {
      onSend?.({text: ''}, true);
    }
  };

  render() {
    const {
      text,
      // containerStyle,
      children,
      textStyle,
      label = 'Send',
      alwaysShowSend,
      disabled,
      sendButtonProps,
    } = this.props;
    if (alwaysShowSend || (text && text.trim().length > 0)) {
      return (
        <TouchableOpacity
          testID="send"
          accessible
          accessibilityLabel="send"
          style={[styles.container]}
          onPress={this.handleOnPress}
          accessibilityRole="button"
          disabled={disabled}
          {...sendButtonProps}>
          <View>
            {children || (
              <Text style={[styles.text, textStyle as ViewStyle]}>{label}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }
    return <View />;
  }
}
