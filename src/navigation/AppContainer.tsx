import * as React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/splash/SplashScreen';
import {ROUTE_NAMES} from './RouteNames';
import {useMemo, useState, createContext} from 'react';
import HomeScreen from '../screens/Home';
import {LogBox} from 'react-native';

// Suppress specific warnings (Recommended for specific cases)
LogBox.ignoreLogs([
  'Cannot update a component while rendering a different component', // Suppress this specific warning
]);

// Or suppress all warnings (Not recommended for production)
//console.disableYellowBox = true; // Older versions of React Native
LogBox.ignoreAllLogs(); // Newer versions of React Native/

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
  // const [isDarkMode, setIsDarkMode] = useState(false);
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

            <Stack.Screen name={ROUTE_NAMES.HOME}>
              {props => (
                <HomeScreen
                  {...props}
                  setBackgroundColor={setBackgroundColor}
                />
              )}
            </Stack.Screen>
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
});

export default AppContainer;
