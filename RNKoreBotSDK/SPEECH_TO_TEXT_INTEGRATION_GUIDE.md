# Speech-to-Text Integration Guide for rn-kore-bot-sdk-v79

This guide provides step-by-step instructions for integrating the `rn-kore-bot-sdk-v79` package with **custom Android speech recognition** functionality in your React Native application.

## 📋 Prerequisites

- React Native 0.79+
- Node.js 18+
- Android Studio with Android SDK
- Xcode (for iOS development)
- Java Development Kit (JDK) 17+

## 🚀 Step-by-Step Integration

### Step 1: Install the Package

```bash
npm install rn-kore-bot-sdk-v79
```

### Step 2: Install Required Dependencies

The package requires several peer dependencies. Install them:

```bash
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install @react-native-documents/picker
npm install react-native-bootsplash
npm install react-native-fs
npm install react-native-gesture-handler
npm install react-native-permissions
npm install react-native-reanimated
npm install react-native-safe-area-context
npm install react-native-screens
npm install react-native-svg
```

Voice recognition is optional. Only install the iOS voice dependency when the
host application wants speech-to-text and branding enables the microphone:

```bash
npm install @react-native-voice/voice
```

### Step 3: Configure React Native Autolinking

Do not disable Android autolinking for `rn-kore-bot-sdk-v79`. The package
contains `VoiceRecognitionModule` and `VoiceRecognitionPackage`, and React
Native 0.79 can discover and register them automatically. If your project
already has a `react-native.config.js`, it may disable only the iOS-inapplicable
voice dependency:

```javascript
module.exports = {
  dependencies: {
    '@react-native-voice/voice': {
      platforms: {
        android: null,
      },
    },
  },
};
```

### Step 4: Android Configuration

#### 4.1 Add Permissions to AndroidManifest.xml

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Required permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

    <!-- Add this queries section for voice recognition -->
    <queries>
        <intent>
            <action android:name="android.speech.RecognitionService" />
        </intent>
    </queries>

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:supportsRtl="true">
      <!-- Your activities here -->
    </application>
</manifest>
```

#### 4.2 Verify Android autolinking

After installing the package, regenerate the React Native configuration and
confirm that the SDK has an Android `sourceDir` and a package instance:

```bash
npx react-native config
```

The output should include `android.sourceDir` pointing to
`node_modules/rn-kore-bot-sdk-v79/android` and
`packageInstance: new VoiceRecognitionPackage()`.

Do not copy Java files into `android/app` or add `VoiceRecognitionPackage()` to
`MainApplication`. Doing both after autolinking can register the module twice.

### Step 5: iOS Configuration

For iOS, the configuration is simpler as it uses autolinking:

#### 5.1 Install iOS Dependencies

```bash
cd ios && pod install && cd ..
```

#### 5.2 Add Permissions to Info.plist

Edit `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice recognition</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs access to speech recognition for voice input</string>
```

### Step 6: Usage in Your React Native Code

Import and use the bot SDK in your components:

```javascript
import React from 'react';
import { View } from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v79';

const YourChatScreen = () => {
  const botConfig = {
    // Your bot configuration
    botId: 'your-bot-id',
    clientId: 'your-client-id',
    // ... other config options
  };

  return (
    <View style={{ flex: 1 }}>
      <KoreChat
        botConfig={botConfig}
        // The speech-to-text will work automatically on both platforms
      />
    </View>
  );
};

export default YourChatScreen;
```

### Step 7: Build and Test

#### 7.1 Clean and Rebuild

```bash
# Clean React Native cache
npx react-native start --reset-cache

# For Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# For iOS
cd ios && rm -rf build && cd ..
npx react-native run-ios
```

#### 7.2 Test Speech Recognition

1. Open your app
2. Navigate to the chat screen
3. Look for the microphone button in the input area
4. Tap the microphone button
5. Speak into the device
6. Verify that speech is converted to text

## 📁 Project Structure Note

The package includes only **one** podspec file: `react-native-rn-kore-bot-sdk.podspec`. This is the correct file that iOS will use for autolinking.

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "VoiceRecognitionModule not found" Error

**Solution:** Remove any host-app `react-native.config.js` entry that sets the
SDK's Android platform to `null`, then run `npx react-native config` and confirm
that `VoiceRecognitionPackage` is autolinked. Rebuild the app after changing
native configuration.

#### 2. "Permission denied" for Microphone

**Solution:** 
- Check that `RECORD_AUDIO` permission is added to AndroidManifest.xml
- For iOS, ensure microphone permission is in Info.plist
- Test on a physical device (permissions don't work in some simulators)

#### 3. "Speech recognition not available"

**Solution:**
- Ensure Google app is installed and updated on Android device
- Check that the device has internet connection (required for speech recognition)
- Verify the `<queries>` section is added to AndroidManifest.xml

#### 4. Build Errors on Android

**Solution:**
- Clean the project: `cd android && ./gradlew clean`
- Ensure Java 17+ is installed
- Check that Android SDK is properly configured

#### 5. iOS Build Errors

**Solution:**
- Run `cd ios && pod install`
- Clean iOS build: `cd ios && rm -rf build`
- Ensure Xcode is updated to latest version

## 📱 Platform-Specific Notes

### Android
- Uses custom native speech recognition implementation
- Requires Google services for speech recognition
- Works on Android 5.0+ (API level 21+)

### iOS
- Uses `@react-native-voice/voice` package
- Requires iOS 11.0+
- Uses Apple's built-in speech recognition

## 🔍 Verification Checklist

Before considering the integration complete, verify:

- [ ] Package is installed: `npm list rn-kore-bot-sdk-v79`
- [ ] All required peer dependencies are installed
- [ ] If voice is enabled: `@react-native-voice/voice` is installed and the iOS pod is present
- [ ] Android autolinking reports `new VoiceRecognitionPackage()`
- [ ] Android permissions are added to AndroidManifest.xml
- [ ] iOS permissions are added to Info.plist
- [ ] iOS pods are installed
- [ ] App builds successfully on both platforms
- [ ] Speech-to-text functionality works in the chat interface

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the package documentation
2. Verify all steps have been completed correctly
3. Test on a physical device (not simulator/emulator)
4. Check React Native and package version compatibility

## 🔄 Updates

When updating the package:

1. Update the npm package: `npm update rn-kore-bot-sdk-v79`
2. Run `cd ios && pod install` for iOS updates
3. Clean and rebuild your project

---

**Note:** This integration guide is specifically for the custom speech recognition functionality. The package includes many other features that work with standard React Native autolinking.
