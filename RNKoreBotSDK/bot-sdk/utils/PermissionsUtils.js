import {Platform, PermissionsAndroid} from 'react-native';
import {showPermissionsAlert} from './PermissionAlert';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

export function documentPickPermission(callback = isSuccess => {}) {
  let permissions = [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];

  if (Platform.Version >= 29) {
    callback(true);
  } else {
    PermissionsAndroid.requestMultiple(permissions).then(result => {
      if (result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
        callback(true);
      } else if (
        result['android.permission.READ_EXTERNAL_STORAGE'] === 'never_ask_again'
      ) {
        callback(false);
        // console.log('');
        let title = 'photos,media and files';
        let on = 'permission';
        showPermissionsAlert(title, on);
      } else if (
        result['android.permission.READ_EXTERNAL_STORAGE'] === 'denied'
      ) {
        callback(false);
        // console.log('');
        let title = 'photos,media and files';
        let on = 'permission';
        showPermissionsAlert(title, on);
      }
    });
  }
}

export function documentPickIOSPermission(callback = isSuccess => {}) {
  let permissions = PERMISSIONS.IOS.PHOTO_LIBRARY;
  requestMultiple([permissions]).then(result => {
    if (
      result[permissions] === 'granted' ||
      result[permissions] === 'limited'
    ) {
      callback(true);
    } else if (result[permissions] === 'blocked') {
      callback(false);
      let title = 'photos or videos';
      let on = 'Photos';
      showPermissionsAlert(title, on);
    } else if (result[permissions] === 'denied') {
      callback(false);
      let title = 'photos or videos';
      let on = 'Photos';
      showPermissionsAlert(title, on);
    }
  });
}
