/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BackHandler, Button, SafeAreaView} from 'react-native';
import {botConfig} from './config/BotConfig';
import KoreChat, {HeaderIconsId, TEMPLATE_TYPES} from 'rn-kore-bot-sdk-v77';
//import CustomButton from './customTemplates/CustomButton';
import {LogBox} from 'react-native';
import {checkAndRequestMicrophonePermission} from './utils/permissionUtils';
import {speechRecognitionService, SpeechRecognitionResult} from './utils/speechUtils';

LogBox?.ignoreLogs?.(['new NativeEventEmitter']); // Ignore log notification by message
LogBox?.ignoreAllLogs?.(); //Ignore all log notifications

interface AppState {
  hasPermission: boolean;
  speechAvailable: boolean;
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
      speechAvailable: false,
    };
  }

  async componentDidMount() {
    // Request microphone permission when component mounts
    // const hasPermission = await checkAndRequestMicrophonePermission();
    
    // Check speech recognition availability
    // const speechAvailable = await speechRecognitionService.checkAvailability();
    
    // this.setState({hasPermission, speechAvailable});
  }

  componentWillUnmount() {
    // Clean up speech recognition service
    speechRecognitionService.destroyRecognizer();
  }
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
  private handleMicrophoneClick = async () => {
    // Check permission before allowing microphone use
    const hasPermission = await checkAndRequestMicrophonePermission();
    
    if (hasPermission) {
      // Start speech recognition
      speechRecognitionService.startListening(this.onSpeechResult);
    }
    
    this.setState({hasPermission});
    return hasPermission;
  };

  private onSpeechResult = (result: SpeechRecognitionResult) => {
    console.log('Speech recognition result:', result);
    
    if (result.success && result.transcript) {
      // Handle successful speech recognition
      console.log('Recognized text:', result.transcript);
      // You can send this text to the chat or handle it as needed
    } else if (result.error) {
      // Handle speech recognition error
      console.log('Speech recognition error:', result.error);
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
