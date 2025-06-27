import {Alert, Linking} from 'react-native';
import {isAndroid} from './PlatformCheck';

export function showPermissionsAlert(title, on) {
  let message =
    'It seems you denied the access for ' +
    title +
    ' earlier, To enable access tap Settings and turn on ' +
    on;
  Alert.alert(isAndroid ? '' : message, isAndroid ? message : '', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'Cancel',
    },
    {text: 'Settings', onPress: () => Linking.openSettings()},
  ]);
}
