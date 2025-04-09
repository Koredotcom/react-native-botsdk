/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BackHandler, SafeAreaView, StyleSheet} from 'react-native';
import {botConfig} from '../../config/BotConfig';
import KoreChat, {HeaderIconsId, TEMPLATE_TYPES} from 'rn-kore-bot-sdk';
import WAKeyboardAvoidingView from './WAKeyboardAvoidingView';
//import CustomButton from './customTemplates/CustomButton';

interface AppState {}
interface AppProps {
  route?: any;
  setBackgroundColor?: (colorCode: string) => void;
}

class HomeScreen extends React.Component<AppProps, AppState> {
  private onHeaderActionsClick = (item: any) => {
    console.log('onHeaderActionsClick item --->:', item);

    switch (item) {
      case HeaderIconsId.BACK:
        BackHandler.exitApp();
        // try {
        //   // if (this.props.navigation?.canGoBack?.()) {
        //   //   this.props.navigation?.goBack?.();
        //   // } else {
        //   //   BackHandler.exitApp();
        //   // }
        // } catch (error) {
        //   BackHandler.exitApp();
        // }
        break;
      case HeaderIconsId.CLOSE:
        BackHandler.exitApp();
        // try {
        //   // if (this.props.navigation?.canGoBack?.()) {
        //   //   this.props.navigation?.goBack?.();
        //   // } else {
        //   //   BackHandler.exitApp();
        //   // }
        // } catch (error) {
        //   BackHandler.exitApp();
        // }
        break;
    }
  };
  private getCustomTemplates() {
    const hashMap = new Map();
    //hashMap.set(TEMPLATE_TYPES.BUTTON, CustomButton);

    return hashMap;
  }
  render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <WAKeyboardAvoidingView style={styles.mainStyle2}>
            <KoreChat
              botConfig={botConfig}
              alwaysShowSend={true}
              //templateInjection={this.getCustomTemplates()}
              //onHeaderActionsClick={this.onHeaderActionsClick}
              statusBarColor={(color: any) => {
                this.props?.setBackgroundColor?.(color);
              }}
              {...this.props}
            />
          </WAKeyboardAvoidingView>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  mainStyle2: {flex: 1, flexDirection: 'column', backgroundColor: 'white'},
});
