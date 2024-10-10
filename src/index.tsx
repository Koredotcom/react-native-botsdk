import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BackHandler, SafeAreaView} from 'react-native';
import {botConfig} from './config/BotConfig';
import KoreChat, {HeaderIconsId, TEMPLATE_TYPES} from 'rn-kore-bot-sdk-69';
//import CustomButton from './customTemplates/CustomButton';

interface AppState {}
interface AppProps {
  navigation?: any;
  route?: any;
}

class App extends React.Component<AppProps, AppState> {
  private onHeaderActionsClick = (item: any) => {
    console.log('onHeaderActionsClick item --->:', item);

    switch (item) {
      case HeaderIconsId.BACK:
        try {
          if (this.props.navigation?.canGoBack?.()) {
            this.props.navigation?.goBack?.();
          } else {
            BackHandler.exitApp();
          }
        } catch (error) {
          BackHandler.exitApp();
        }
        break;
      case HeaderIconsId.CLOSE:
        try {
          if (this.props.navigation?.canGoBack?.()) {
            this.props.navigation?.goBack?.();
          } else {
            BackHandler.exitApp();
          }
        } catch (error) {
          BackHandler.exitApp();
        }
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
          <KoreChat
            botConfig={botConfig}
            alwaysShowSend={true}
            //templateInjection={this.getCustomTemplates()}
            //onHeaderActionsClick={this.onHeaderActionsClick}
            {...this.props}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
}

export default App;
