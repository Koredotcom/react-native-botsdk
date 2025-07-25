import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Color from '../../theme/Color';
import {useChatContext} from '../BotChatContext';
import {useCallbackOne} from 'use-memo-one';

export interface ActionsProps {
  options?: {[key: string]: any};
  optionTintColor?: string;
  icon?: () => any;
  wrapperStyle?: StyleProp<ViewStyle>;
  iconTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPressActionButton?(): void;
}

export function Actions({
  options = {},
  optionTintColor = Color.optionTintColor,
  icon,
  wrapperStyle,
  iconTextStyle,
  onPressActionButton,
  containerStyle,
}: ActionsProps) {
  const {actionSheet} = useChatContext();
  const onActionsPress = useCallbackOne(() => {
    const optionKeys = Object.keys(options);
    const cancelButtonIndex = optionKeys.indexOf('Cancel');
    actionSheet().showActionSheetWithOptions(
      {
        options: optionKeys,
        cancelButtonIndex,
        tintColor: optionTintColor,
      },
      (buttonIndex: number) => {
        const key = optionKeys[buttonIndex];
        if (key) {
          options[key]();
        }
      },
    );
  }, []);

  const renderIcon = useCallbackOne(() => {
    if (icon) {
      return icon();
    }
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    );
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPressActionButton || onActionsPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: Color.defaultColor,
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    textAlign: 'center',
  },
});
