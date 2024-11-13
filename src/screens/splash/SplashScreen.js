import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {ROUTE_NAMES} from '../../navigation/RouteNames';

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    RNBootSplash.hide({fade: true});
    setTimeout(() => {
      this.props.navigation.replace(ROUTE_NAMES.HOME);
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

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
  },
  titleText: {fontSize: 25, fontWeight: '800', color: 'black'},
});
