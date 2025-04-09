/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import 'react-native-svg';
import AppContainer from './navigation/AppContainer';
import {StatusBar, View} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

class App extends React.Component {
  render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <StatusBar
            barStyle="dark-content" // Sets the text/icons to light color
            backgroundColor={'white'} // Sets the status bar background color
          />
          <AppContainer />
        </View>
      </GestureHandlerRootView>
    );
  }
}

export default App;
