import {Alert, Platform, Linking} from 'react-native';
import {
  PERMISSIONS,
  request,
  check,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

export const getMicrophonePermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios: PERMISSIONS.IOS.MICROPHONE,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return check(permission);
};

export const requestMicrophonePermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios: PERMISSIONS.IOS.MICROPHONE,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return request(permission);
};

export const checkAndRequestMicrophonePermission = async (): Promise<boolean> => {
  try {
    let permissionStatus = await getMicrophonePermission();
    
    if (permissionStatus === RESULTS.DENIED) {
      permissionStatus = await requestMicrophonePermission();
    }
    
    if (permissionStatus === RESULTS.GRANTED) {
      return true;
    } else if (permissionStatus === RESULTS.BLOCKED || permissionStatus === RESULTS.UNAVAILABLE) {
      Alert.alert(
        'Microphone Permission Required',
        'This app needs microphone access for voice input functionality. Please enable microphone permission in your device settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Settings', onPress: () => {
            Linking.openSettings();
          }},
        ]
      );
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking microphone permission:', error);
    return false;
  }
};

// Camera Permission Utils
export const getCameraPermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return check(permission);
};

export const requestCameraPermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return request(permission);
};

export const checkAndRequestCameraPermission = async (): Promise<boolean> => {
  try {
    let permissionStatus = await getCameraPermission();
    
    if (permissionStatus === RESULTS.DENIED) {
      permissionStatus = await requestCameraPermission();
    }
    
    if (permissionStatus === RESULTS.GRANTED) {
      return true;
    } else if (permissionStatus === RESULTS.BLOCKED || permissionStatus === RESULTS.UNAVAILABLE) {
      Alert.alert(
        'Camera Permission Required',
        'This app needs camera access to take photos and videos. Please enable camera permission in your device settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Settings', onPress: () => {
            Linking.openSettings();
          }},
        ]
      );
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

// Photo Library Permission Utils
export const getPhotoLibraryPermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return check(permission);
};

export const requestPhotoLibraryPermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return request(permission);
};

export const checkAndRequestPhotoLibraryPermission = async (): Promise<boolean> => {
  try {
    let permissionStatus = await getPhotoLibraryPermission();
    
    if (permissionStatus === RESULTS.DENIED) {
      permissionStatus = await requestPhotoLibraryPermission();
    }
    
    if (permissionStatus === RESULTS.GRANTED) {
      return true;
    } else if (permissionStatus === RESULTS.BLOCKED || permissionStatus === RESULTS.UNAVAILABLE) {
      Alert.alert(
        'Photo Library Permission Required',
        'This app needs access to your photo library to select and share images. Please enable photo library permission in your device settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Settings', onPress: () => {
            Linking.openSettings();
          }},
        ]
      );
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking photo library permission:', error);
    return false;
  }
};

// Storage Permission Utils (for document access)
export const getStoragePermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY, // iOS doesn't have explicit storage permission
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return check(permission);
};

export const requestStoragePermission = (): Promise<PermissionStatus> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  });

  if (!permission) {
    return Promise.reject(new Error('Platform not supported'));
  }

  return request(permission);
};

export const checkAndRequestStoragePermission = async (): Promise<boolean> => {
  try {
    let permissionStatus = await getStoragePermission();
    
    if (permissionStatus === RESULTS.DENIED) {
      permissionStatus = await requestStoragePermission();
    }
    
    if (permissionStatus === RESULTS.GRANTED) {
      return true;
    } else if (permissionStatus === RESULTS.BLOCKED || permissionStatus === RESULTS.UNAVAILABLE) {
      Alert.alert(
        'Storage Permission Required',
        'This app needs access to your device storage to access documents and files. Please enable storage permission in your device settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Settings', onPress: () => {
            Linking.openSettings();
          }},
        ]
      );
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking storage permission:', error);
    return false;
  }
};

// Utility function to check and request multiple permissions at once
export const checkAndRequestMultiplePermissions = async (
  permissions: ('microphone' | 'camera' | 'photoLibrary' | 'storage')[]
): Promise<{[key: string]: boolean}> => {
  const results: {[key: string]: boolean} = {};
  
  for (const permission of permissions) {
    switch (permission) {
      case 'microphone':
        results.microphone = await checkAndRequestMicrophonePermission();
        break;
      case 'camera':
        results.camera = await checkAndRequestCameraPermission();
        break;
      case 'photoLibrary':
        results.photoLibrary = await checkAndRequestPhotoLibraryPermission();
        break;
      case 'storage':
        results.storage = await checkAndRequestStoragePermission();
        break;
    }
  }
  
  return results;
}; 