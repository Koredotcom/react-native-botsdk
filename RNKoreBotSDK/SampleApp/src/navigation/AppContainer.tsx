import * as React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/splash/SplashScreen';
import {ROUTE_NAMES} from './RouteNames';
import HomeScreen from '../screens/Home';
import WelcomeScreen from '../screens/WelcomeScreen';
import {useMemo, useState, createContext} from 'react';

const Stack = createStackNavigator();

// Create a ThemeContext to provide background color and setter
const ThemeContext = createContext<{
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}>({
  backgroundColor: 'white',
  setBackgroundColor: () => {},
});

const AppContainer = React.memo(() => {
  const [backgroundColor, setBackgroundColor] = useState('white');

  // Create a custom theme object based on the state
  const theme = useMemo(
    (): Theme => ({
      dark: false,
      colors: {
        background: backgroundColor,
        primary: '',
        card: '',
        text: '',
        border: '',
        notification: '',
      },
    }),
    [backgroundColor],
  );

  return (
    <ThemeContext.Provider value={{backgroundColor, setBackgroundColor}}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName={ROUTE_NAMES.SPLASH}
          screenOptions={{headerShown: false}}>
          <Stack.Group>
            <Stack.Screen name={ROUTE_NAMES.SPLASH} component={SplashScreen} />
            <Stack.Screen
              name={ROUTE_NAMES.WELCOME_SCREEN}
              component={WelcomeScreen}
            />
            <Stack.Screen name={ROUTE_NAMES.HOME}>
              {props => (
                <HomeScreen {...props} onStatusBarColor={setBackgroundColor} />
              )}
            </Stack.Screen>
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
});

export default AppContainer;

{
  /* <HomeScreen {...props} onStatusBarColor={setStatusBarColor} /> */
}
