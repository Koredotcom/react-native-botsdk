import * as React from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

const BEHAVIOR = Platform.OS === 'ios' ? 'padding' : undefined;

export const WAKeyboardAvoidingView = (props: any) => {
  const headerHeight = useHeaderHeight();
  const statusBarHeight = StatusBar.currentHeight || 0;
  return (
    <KeyboardAvoidingView
      style={[styles.container, props.style]}
      behavior={BEHAVIOR}
      keyboardVerticalOffset={headerHeight + statusBarHeight}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WAKeyboardAvoidingView;
