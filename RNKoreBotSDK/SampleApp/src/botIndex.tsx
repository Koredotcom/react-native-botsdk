/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import AppContainer from './navigation/AppContainer';
import {View} from 'react-native';
import {StatusBar} from 'react-native';

import {LogBox} from 'react-native';
import Color from './utils/Color';

// Conditionally initialize native modules to prevent NativeEventEmitter errors
let GestureHandlerRootView: any = View; // Fallback to regular View
let Reactotron: any = null;

try {
  // Conditionally load react-native-svg
  require('react-native-svg');
} catch (error) {
  console.warn('react-native-svg not available, SVG features will be disabled');
}

try {
  // Conditionally load react-native-reanimated
  require('react-native-reanimated');
} catch (error) {
  console.warn('react-native-reanimated not available, animations will be limited');
}

try {
  // Conditionally load gesture handler
  const gestureHandler = require('react-native-gesture-handler');
  GestureHandlerRootView = gestureHandler.GestureHandlerRootView;
} catch (error) {
  console.warn('react-native-gesture-handler not available, using regular View');
}

try {
  // Conditionally load Reactotron
  Reactotron = require('reactotron-react-native').default;
  
  // Safely access NativeModules
  const {NativeModules} = require('react-native');
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  const scriptHostname = scriptURL 
    ? scriptURL.split('://')[1]?.split(':')[0] 
    : 'localhost';
  
  if (Reactotron && Reactotron.configure) {
    Reactotron.configure({host: scriptHostname}).connect();
  }
} catch (error) {
  console.warn('Reactotron not available or NativeModules access failed:', error);
}

LogBox?.ignoreLogs?.(['new NativeEventEmitter']); // Ignore log notification by message
LogBox?.ignoreAllLogs?.(); //Ignore all log notifications

class App extends React.Component {
  render() {
    StatusBar.setBarStyle('dark-content');
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <StatusBar
            barStyle="dark-content" // Sets the text/icons to light color
            backgroundColor={Color.white} // Sets the status bar background color
          />
          <AppContainer />
        </View>
      </GestureHandlerRootView>
    );
  }
}

export default App;
