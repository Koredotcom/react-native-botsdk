import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Color from '../../theme/Color';
import {normalize} from '../../utils/helpers';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.defaultColor,
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
    fontSize: normalize(12),
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
      default: -15,
    }),
  },
});

export interface LoadEarlierProps {
  isLoadingEarlier?: boolean;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activityIndicatorStyle?: StyleProp<ViewStyle>;
  activityIndicatorColor?: string;
  activityIndicatorSize?: number | 'small' | 'large';
  onLoadEarlier?(): void;
}

export default class LoadEarlier extends React.Component<LoadEarlierProps, {}> {
  constructor(props: any) {
    super(props);
  }

  static defaultProps: {
    onLoadEarlier: () => {};
    isLoadingEarlier: false;
    label: 'Load earlier messages';
    containerStyle: {};
    wrapperStyle: {};
    textStyle: {};
    activityIndicatorStyle: {};
    activityIndicatorColor: 'white';
    activityIndicatorSize: 'small';
  };

  renderLoading() {
    if (this.props.isLoadingEarlier === false) {
      return (
        <Text style={[styles.text, this.props.textStyle]}>
          {this.props.label}
        </Text>
      );
    }
    return (
      <View>
        <Text style={[styles.text, this.props.textStyle, {opacity: 0}]}>
          {this.props.label}
        </Text>
        <ActivityIndicator
          color={this.props.activityIndicatorColor}
          size={this.props.activityIndicatorSize}
          style={[styles.activityIndicator, this.props.activityIndicatorStyle]}
        />
      </View>
    );
  }
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          if (this.props.onLoadEarlier) {
            this.props.onLoadEarlier();
          }
        }}
        disabled={this.props.isLoadingEarlier === true}
        accessibilityRole="button">
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          {this.renderLoading()}
        </View>
      </TouchableOpacity>
    );
  }
}
