/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native';
import {botConfig} from './config/BotConfig';
import KoreChat from 'rn-kore-bot-sdk-v79-test';
//import CustomButton from './customTemplates/CustomButton';
import {LogBox} from 'react-native';
import {checkAndRequestMicrophonePermission} from './utils/permissionUtils';

LogBox?.ignoreLogs?.(['new NativeEventEmitter']); // Ignore log notification by message
LogBox?.ignoreAllLogs?.(); //Ignore all log notifications

interface AppState {
  hasPermission: boolean;
}
interface AppProps {
  navigation?: any;
  route?: any;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      hasPermission: false,
    };
  }

  async componentDidMount() {
    // Request microphone permission when component mounts
    const hasPermission = await checkAndRequestMicrophonePermission();
    
    this.setState({hasPermission});
  }

  render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
        <KoreChat
            botConfig={botConfig}
            // renderInputToolbar={this.renderInputToolbar}
            //renderComposer={this.renderComposer}
            //renderSend={this.renderSend}
            //renderActions={this.renderActions}
            alwaysShowSend={true}
            //onListItemClick={this.onListItemClick}
            //renderTypingIndicator={this.renderTypingIndicator}

            //scrollToBottom={true}
            //renderQuickRepliesView={renderQuickRepliesView}
            //onSend={onSend}
            // onLongPress={onLongPress}
            // isTyping={false}
            //renderSuggestionsView={this.renderSuggestionsView}
            //initialText={'Help'}
            //templateInjection={this.getCustomTemplates()}
            // statusBarColor={(color: any) => {
            //   this.props.onStatusBarColor(color);
            // }}
            //onHeaderActionsClick={this.onHeaderActionsClick}
            {...this.props}
          />
          {/* <Button title="Click me" onPress={() => {
            console.log('Button pressed');
          }} /> */}
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
}

export default App;
