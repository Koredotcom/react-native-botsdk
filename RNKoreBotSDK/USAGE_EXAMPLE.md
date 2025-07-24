# Usage Example - Safe Native Module Integration

This example demonstrates how to safely use the `rn-kore-bot-sdk-v77` library in your React Native application.

## Basic Setup

### 1. Install the library
```bash
npm install rn-kore-bot-sdk-v77
```

### 2. Install required dependencies
```bash
# Install all required dependencies
npm install @react-native-async-storage/async-storage@^2.2.0
npm install @react-native-clipboard/clipboard@^1.16.2
npm install @react-native-community/netinfo@^11.4.1
npm install @react-navigation/elements@^2.5.1
npm install @react-navigation/stack@^7.4.1
npm install react-native-bootsplash@^6.3.9
npm install react-native-device-info@^14.0.4
npm install react-native-fast-image@^8.6.3
npm install react-native-fs@^2.20.0
npm install react-native-gesture-handler@^2.25.0
npm install react-native-permissions@^5.4.1
npm install react-native-reanimated@^3.18.0
npm install react-native-svg@^15.12.0
npm install react-native-uuid@^2.0.3
```

### 3. Install optional dependencies (for enhanced features)
```bash
# Optional: For voice-to-text functionality
npm install @react-native-voice/voice@^3.2.4

# Optional: For enhanced file operations
npm install react-native-blob-util@^0.22.2
npm install react-native-file-viewer@^2.1.5

# Optional: For additional UI components
npm install @react-native-community/checkbox@^0.5.20
npm install @react-native-picker/picker@^2.11.0
# Charts are now handled by react-native-gifted-charts (already included)
npm install react-native-modal@^14.0.0-rc.1
npm install react-native-video@^6.15.0
```

### 4. Link native modules (if using React Native < 0.60)
```bash
cd ios && pod install
```

## Safe Usage Pattern

### App.tsx
```typescript
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v77';

const App = () => {
  const botConfig = {
    // Your bot configuration
    botId: 'your-bot-id',
    clientId: 'your-client-id',
    // ... other config
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <KoreChat config={botConfig} />
    </SafeAreaView>
  );
};

export default App;
```

## Handling Native Module Failures

The library now gracefully handles cases where native modules are not available:

### Voice Recognition
- **Available**: Full voice-to-text functionality
- **Not Available**: Voice button hidden, text input only

### File Handling
- **Available**: Full file upload/download capabilities
- **Not Available**: File operations will show warnings but won't crash

### Monitoring Console
```typescript
// The library will log warnings like:
// "Voice or Permissions module not available"
// "File handling modules not available"
// "FileViewer not available or invalid file path"
```

## Troubleshooting Common Issues

### 1. Metro bundler issues
Update your `metro.config.js`:
```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['ios', 'android', 'native', 'web'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 2. iOS Permissions
Add to your `ios/YourProject/Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice messages</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app uses speech recognition for voice-to-text functionality</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library for file attachments</string>
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera for taking photos</string>
```

### 3. Android Permissions
Add to your `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

## Selective Feature Usage

You can now safely use the library even if some native modules are missing:

```typescript
import { KoreChat, QuickReplies, CustomTemplate } from 'rn-kore-bot-sdk-v77';

// Core chat functionality will work even without all native modules
const MinimalChatApp = () => (
  <KoreChat 
    config={botConfig}
    // Voice will be disabled automatically if not available
    // File handling will show warnings but won't crash
  />
);
```

## Complete Example

See the `src/botIndex.tsx` file in this repository for a complete working example with all features enabled.

## Permission Issues

### "Microphone permission denied" Error

This error means the voice functionality is working but needs proper setup:

#### ✅ **This is Good News!**
- NativeEventEmitter error is fixed
- Voice module is loaded successfully
- Library is correctly requesting permissions

#### 🔧 **Solutions:**

1. **Add Permission Descriptions** (see iOS/Android sections above)
2. **Test Permission Flow**:
   ```bash
   # iOS: Reset permissions
   Simulator > Device > Erase All Content and Settings
   
   # Android: Clear app data
   Settings > Apps > [Your App] > Storage > Clear Data
   ```

3. **Check Permission Status**:
   - Voice button should appear/disappear based on permissions
   - Console will show permission-related logs
   - User will be prompted for permission on first voice usage

#### 🔍 **Expected Behavior:**
- **With Permissions**: Voice button visible, voice-to-text works
- **Without Permissions**: Voice button hidden or disabled
- **Permission Denied**: Error logged but app continues working

## Support

If you encounter issues:
1. Check that all peer dependencies are installed
2. Verify native module linking (iOS: pod install, Android: rebuild)
3. Check console warnings for specific module availability
4. Verify permission setup for voice features
5. Open an issue on GitHub with your configuration and error logs 