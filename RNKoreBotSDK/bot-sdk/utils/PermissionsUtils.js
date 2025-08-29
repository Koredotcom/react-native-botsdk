import {Platform, PermissionsAndroid, Alert, Linking} from 'react-native';
import {showPermissionsAlert} from './PermissionAlert';

// Import react-native-permissions properly
import {
  PERMISSIONS,
  request,
  check,
  RESULTS,
} from 'react-native-permissions';

export function documentPickPermission(callback = isSuccess => {}) {
  if (Platform.OS !== 'android') {
    callback(false);
    return;
  }

  // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
  // For Android 10-12 (API 29-32), use READ_EXTERNAL_STORAGE  
  // For Android 9 and below (API 28-), use READ_EXTERNAL_STORAGE
  
  const androidVersion = Platform.Version;
  let permissions = [];
  
  if (androidVersion >= 33) {
    // Android 13+ - Use granular media permissions
    permissions = [
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ];
  } else {
    // Android 12 and below - Use READ_EXTERNAL_STORAGE
    permissions = [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];
  }

  console.log('Requesting Android permissions:', permissions, 'for API level:', androidVersion);

  PermissionsAndroid.requestMultiple(permissions)
    .then(result => {
      console.log('Permission request result:', result);
      
      let allGranted = true;
      let hasBlockedPermissions = false;
      
      // Check if all permissions are granted
      for (const permission of permissions) {
        const status = result[permission];
        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          allGranted = false;
          if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            hasBlockedPermissions = true;
          }
        }
      }
      
      if (allGranted) {
        console.log('All Android permissions granted');
        callback(true);
      } else {
        console.log('Some Android permissions denied');
        callback(false);
        
        if (hasBlockedPermissions) {
          // Show alert for blocked permissions
          Alert.alert(
            'Permission Required',
            'This app needs access to your photos and media files to upload images. Please enable the permissions in your device settings.',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Settings', onPress: () => Linking.openSettings()},
            ]
          );
        } else {
          // Show generic alert for denied permissions
          let title = 'photos, media and files';
          let on = 'permission';
          showPermissionsAlert(title, on);
        }
      }
    })
    .catch(error => {
      console.error('Error requesting Android permissions:', error);
      callback(false);
    });
}

export function documentPickIOSPermission(callback = isSuccess => {}) {
  if (Platform.OS !== 'ios') {
    callback(false);
    return;
  }

  // Check if react-native-permissions is available
  if (!PERMISSIONS || !check || !request || !RESULTS) {
    console.warn('react-native-permissions not available, trying native fallback');
    tryIOSNativePermission(callback);
    return;
  }

  const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  
  console.log('Checking iOS photo library permission');
  
  // First check current permission status
  check(permission)
    .then(result => {
      console.log('iOS permission check result:', result);
      
      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        console.log('iOS photo library permission already granted');
        callback(true);
      } else if (result === RESULTS.DENIED) {
        console.log('iOS photo library permission denied, requesting...');
        // Permission denied, request it
        return request(permission);
      } else if (result === RESULTS.UNAVAILABLE) {
        console.error('iOS photo library permission unavailable - check Podfile configuration');
        // Try using iOS native permission check as fallback
        tryIOSNativePermission(callback);
        return;
      } else {
        console.log('iOS photo library permission blocked:', result);
        callback(false);
        showPermissionBlockedAlert();
      }
    })
    .then(requestResult => {
      if (requestResult) {
        console.log('iOS permission request result:', requestResult);
        
        if (requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED) {
          console.log('iOS photo library permission granted after request');
          callback(true);
        } else {
          console.log('iOS photo library permission denied after request');
          callback(false);
          
          if (requestResult === RESULTS.BLOCKED) {
            showPermissionBlockedAlert();
          }
        }
      }
    })
    .catch(error => {
      console.error('Error with iOS photo library permission:', error);
      // Try native permission check as fallback
      tryIOSNativePermission(callback);
    });
}

// Fallback function for iOS when react-native-permissions fails
async function tryIOSNativePermission(callback) {
  console.log('Trying iOS native permission fallback');
  
  // For iOS, we can try using react-native-image-picker's built-in permission handling
  // Since it handles permissions automatically
  try {
    // Use dynamic import for lazy loading
    const ImagePicker = await import('react-native-image-picker');
    
    if (ImagePicker && ImagePicker.requestMediaLibraryPermission) {
      ImagePicker.requestMediaLibraryPermission()
        .then(granted => {
          console.log('iOS native permission result:', granted);
          callback(granted);
        })
        .catch(error => {
          console.error('iOS native permission error:', error);
          callback(false);
        });
    } else {
      // If no native fallback, just proceed and let image picker handle it
      console.log('No native permission fallback available, proceeding...');
      callback(true);
    }
  } catch (error) {
    console.error('Error with iOS native permission fallback:', error);
    callback(false);
  }
}

function showPermissionBlockedAlert() {
  Alert.alert(
    'Permission Required',
    'This app needs access to your photo library to select and share images. Please enable photo library access in your device settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Settings', onPress: () => Linking.openSettings()},
    ]
  );
}

// Enhanced permission checking function for camera
export function cameraPermission(callback = isSuccess => {}) {
  if (!PERMISSIONS || !check || !request || !RESULTS) {
    console.warn('react-native-permissions not available for camera, trying native fallback');
    // Try native fallback for camera
    tryNativeCameraPermission(callback);
    return;
  }

  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  if (!permission) {
    console.error('Camera permission not supported on this platform');
    callback(false);
    return;
  }

  console.log('Checking camera permission');
  
  check(permission)
    .then(result => {
      console.log('Camera permission check result:', result);
      
      if (result === RESULTS.GRANTED) {
        callback(true);
      } else if (result === RESULTS.DENIED) {
        console.log('Camera permission denied, requesting...');
        return request(permission);
      } else if (result === RESULTS.UNAVAILABLE) {
        console.error('Camera permission unavailable - trying native fallback');
        tryNativeCameraPermission(callback);
        return;
      } else {
        console.log('Camera permission blocked or unavailable:', result);
        callback(false);
        showCameraPermissionBlockedAlert();
      }
    })
    .then(requestResult => {
      if (requestResult) {
        console.log('Camera permission request result:', requestResult);
        
        if (requestResult === RESULTS.GRANTED) {
          callback(true);
        } else {
          callback(false);
          if (requestResult === RESULTS.BLOCKED) {
            showCameraPermissionBlockedAlert();
          }
        }
      }
    })
    .catch(error => {
      console.error('Error with camera permission:', error);
      tryNativeCameraPermission(callback);
    });
}

async function tryNativeCameraPermission(callback) {
  console.log('Trying native camera permission fallback');
  
  try {
    // Use dynamic import for lazy loading
    const ImagePicker = await import('react-native-image-picker');
    
    if (ImagePicker && ImagePicker.requestCameraPermission) {
      ImagePicker.requestCameraPermission()
        .then(granted => {
          console.log('Native camera permission result:', granted);
          callback(granted);
        })
        .catch(error => {
          console.error('Native camera permission error:', error);
          callback(false);
        });
    } else {
      // If no native fallback, just proceed
      console.log('No native camera permission fallback available, proceeding...');
      callback(true);
    }
  } catch (error) {
    console.error('Error with native camera permission fallback:', error);
    callback(false);
  }
}

function showCameraPermissionBlockedAlert() {
  Alert.alert(
    'Camera Permission Required',
    'This app needs camera access to take photos. Please enable camera permission in your device settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Settings', onPress: () => Linking.openSettings()},
    ]
  );
}
