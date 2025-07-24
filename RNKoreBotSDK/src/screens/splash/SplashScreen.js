import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
// import {connect} from 'react-redux';
// import KoraIcon from '../../assets/KoraIcon.svg';
//import {initializeAccount} from '../../actions/auth.action';
import styles from './styles';
import RNBootSplash from 'react-native-bootsplash';
import {ROUTE_NAMES} from '../../navigation/RouteNames';

// interface SplashScreenProps {
//   navigation: any;
// }

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    RNBootSplash.hide({fade: true});
    setTimeout(() => {
      this.props.navigation.replace(ROUTE_NAMES.WELCOME_SCREEN);
    }, 2000);
  }

  render() {
    return (
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.container}>
          <Text style={styles.titleText}>{'Welcome'}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default SplashScreen;
