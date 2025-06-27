import React, {createContext, useContext, ReactNode, Component} from 'react';
import {ThemeType} from './ThemeType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BRANDING_RESPONSE_FILE} from '../constants/Constant';
import {defaultTheme} from './AppTheme';

// Define your theme object type

// Create a context object
export const ThemeContext = createContext<ThemeType | undefined>(undefined);

// Create a provider component
// export const ThemeProvider: React.FC<{
//   theme: ThemeType;
//   children: ReactNode;
// }> = ({theme, children}) => {
//   return (
//     <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
//   );
// };

export class ThemeProvider extends Component<{
  children: ReactNode;
}> {
  state = {
    theme: defaultTheme,
  };

  componentDidMount() {
    this.fetchThemeFromDB();
  }

  private fetchThemeFromDB = async () => {
    try {
      AsyncStorage.getItem(BRANDING_RESPONSE_FILE, (error, result) => {
        if (result) {
          const savedTheme = JSON.parse(result);
          this.setState({theme: savedTheme});
        }
      });
    } catch (error) {
      console.log('Error fetching theme from local storage:', error);
    }
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

// Custom hook to consume the theme
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};
