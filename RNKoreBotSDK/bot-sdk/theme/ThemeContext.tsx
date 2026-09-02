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

interface ThemeProviderProps {
  children: ReactNode;
  /**
   * The current theme from the branding API. `null` means that no remote
   * theme is available and the provider should use the default theme.
   */
  theme?: ThemeType | null;
}

interface ThemeProviderState {
  theme: ThemeType;
}

export class ThemeProvider extends Component<
  ThemeProviderProps,
  ThemeProviderState
> {
  state: ThemeProviderState = {
    theme: this.props.theme || defaultTheme,
  };

  componentDidMount() {
    // The API response is authoritative when it is already available. Only
    // load the persisted theme while the chat is waiting for the API.
    if (this.props.theme == null) {
      this.fetchThemeFromDB();
    }
  }

  componentDidUpdate(previousProps: ThemeProviderProps) {
    if (this.props.theme && this.props.theme !== previousProps.theme) {
      this.setState({theme: this.props.theme});
    } else if (
      this.props.theme === null &&
      previousProps.theme !== null
    ) {
      this.setState({theme: defaultTheme});
    }
  }

  private fetchThemeFromDB = async () => {
    try {
      const result = await AsyncStorage.getItem(BRANDING_RESPONSE_FILE);
      // Do not allow a slower storage read to overwrite a newer API response.
      if (result && this.props.theme == null) {
        const savedTheme = JSON.parse(result) as ThemeType;
        this.setState({theme: savedTheme});
      }
    } catch (error) {
      console.log('Error fetching theme from local storage:', error);
    }
  };

  render() {
    // Use the API value directly during this render so branding is visible
    // immediately; the state update above keeps it as the fallback if the
    // prop is later removed.
    const theme =
      this.props.theme === null
        ? defaultTheme
        : this.props.theme || this.state.theme;

    return (
      <ThemeContext.Provider value={theme}>
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
