/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
//import {IThemeType} from '../../theme/IThemeType';
import WelcomeBody from './body';
import WelcomeFooter from './footer';
import WelcomeHeader from './Header';
import {BaseViewProps, BaseViewState, WelcomeBaseView} from './WelcomeBaseView';
import Color from '../../theme/Color';
import {isBlackStatusBar, isWhiteStatusBar} from '../../utils/helpers';

interface WelcomeProps extends BaseViewProps {}
interface WelcomeState extends BaseViewState {}

export default class Welcome extends WelcomeBaseView<
  WelcomeProps,
  WelcomeState
> {
  render() {
    const bgColor = this.props.activetheme?.v3?.header?.bg_color;
    const isWhiteStatus = isWhiteStatusBar(bgColor);
    const isBlackStatus = isBlackStatusBar(bgColor);
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor:
              this.props.activetheme?.v3?.welcome_screen?.bottom_background
                ?.color || Color.white,
            flex: 1,
          }}>
          {bgColor && !isWhiteStatus ? (
            <StatusBar
              barStyle={isBlackStatus ? 'default' : 'dark-content'}
              backgroundColor={bgColor}
            />
          ) : (
            <StatusBar
              barStyle="dark-content" // Sets the text/icons to light color
              backgroundColor={Color.white} // Sets the status bar background color
            />
          )}

          <WelcomeHeader {...this.props} />
          <ScrollView style={{flex: 1, backgroundColor: Color.transparent}}>
            <WelcomeBody {...this.props} />
          </ScrollView>
          <WelcomeFooter {...this.props} />
        </View>
      </SafeAreaView>
    );
  }
}
