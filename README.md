# React Native Kore Bot SDK

A comprehensive React Native library for integrating Kore.ai chatbot functionality into your mobile applications.

## Features

- 🤖 Complete chatbot UI components
- 💬 Rich messaging templates (text, images, cards, carousels)
- 🎨 Customizable themes and styling
- 📱 Cross-platform support (iOS & Android)
- 🔧 TypeScript support
- 🎯 Easy integration with existing React Native apps

## Installation

```bash
npm install rn-kore-bot-sdk-v77
```

### Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```bash
npm install react-native@0.77.0 react@18.3.1 @react-native-async-storage/async-storage @react-native-community/netinfo react-native-gesture-handler react-native-reanimated react-native-svg react-native-safe-area-context
```

## Usage

### Basic Setup

```tsx
import React from 'react';
import { View } from 'react-native';
import KoreChat, { BotConfigModel } from 'rn-kore-bot-sdk-v77';

const App = () => {
  const botConfig: BotConfigModel = {
    botId: 'your-bot-id',
    chatBotName: 'Your Bot Name',
    serverUrl: 'your-server-url', // Should not end with '/', Example :  https://your.server.url
    brandingAPIUrl: 'your-branding-api-url', // Should not end with '/', Example :  https://your.server.url
    // Add other required config properties
  };

  return (
    <View style={{ flex: 1 }}>
      <KoreChat
        botConfig={botConfig}
        onListItemClick={(item) => console.log('Item clicked:', item)}
        onHeaderActionsClick={(action) => console.log('Header action:', action)}
      />
    </View>
  );
};

export default App;
```

### Custom Templates

```tsx
import { CustomTemplate } from 'rn-kore-bot-sdk-v77';

// Create custom template
const MyCustomTemplate = new CustomTemplate({
  // Your custom template implementation
});

// Use with KoreChat
<KoreChat
  botConfig={botConfig}
  templateInjection={new Map([
    ['custom-template', MyCustomTemplate]
  ])}
/>
```

## API Reference

### KoreChat Props

| Prop | Type | Description |
|------|------|-------------|
| `botConfig` | `BotConfigModel` | Bot configuration object |
| `onListItemClick` | `(item: any) => void` | Callback for list item clicks |
| `onHeaderActionsClick` | `(action: any) => void` | Callback for header actions |
| `templateInjection` | `Map<string, CustomTemplate>` | Custom template injection |

### BotConfigModel

```tsx
interface BotConfigModel {
  botId: string;
  chatBotName: string;
  serverUrl: string;
  brandingAPIUrl: string;
  // Add other config properties
}
```

## Customization

### Theming

The library supports custom theming through the theme context:

```tsx
import { ThemeProvider } from 'rn-kore-bot-sdk-v77';

const customTheme = {
  // Your theme configuration
};

<ThemeProvider theme={customTheme}>
  <KoreChat botConfig={botConfig} />
</ThemeProvider>
```

## Examples

Check out the `/SampleUI` directory for complete implementation examples.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

## NativeEventEmitter Fix

This version includes important fixes to prevent the "NativeEventEmitter() requires a non-null argument" error when using this library in another React Native application.

### What was fixed:

1. **Conditional Native Module Loading**: Native modules like `@react-native-voice/voice`, `react-native-blob-util`, `react-native-fs`, and `react-native-file-viewer` are now loaded conditionally to prevent initialization errors.

2. **Graceful Degradation**: When native modules are not available, the library will log appropriate warnings and continue to function with reduced functionality.

3. **Proper Error Handling**: All native module interactions are wrapped in try-catch blocks to prevent crashes.

### Installation Requirements:

To integrate `rn-kore-bot-sdk-v77` into your React Native application, you need to install the following required dependencies:

```bash
# Install the main library
npm install rn-kore-bot-sdk-v77

# Install required dependencies
npm install @react-native-async-storage/async-storage
npm install @react-native-clipboard/clipboard
npm install @react-native-community/netinfo
npm install @react-navigation/elements
npm install @react-navigation/stack
npm install react-native-bootsplash
npm install react-native-device-info
npm install react-native-fast-image
npm install react-native-fs
npm install react-native-gesture-handler
npm install react-native-permissions
npm install react-native-reanimated
npm install react-native-svg
npm install react-native-uuid
```

**Note:** These dependencies are essential for the library to function properly. The library uses conditional loading, so if any of these modules are missing, related features will be disabled gracefully with appropriate warnings.

### Optional Dependencies (for Enhanced Features):

For additional functionality like voice input and advanced file handling, you can optionally install:

```bash
# Optional: For voice-to-text functionality
npm install @react-native-voice/voice

# Optional: For enhanced file operations
npm install react-native-blob-util
npm install react-native-file-viewer

# Optional: For additional features
npm install @react-native-community/checkbox
npm install @react-native-picker/picker
npm install react-native-charts-wrapper
npm install react-native-modal
npm install react-native-video
```

If these optional dependencies are not installed, the related features will be automatically disabled without affecting the core functionality.

### Quick Installation (All Dependencies):

For a complete installation with all features enabled, run:

```bash
# Install everything at once
npm install rn-kore-bot-sdk-v77 @react-native-async-storage/async-storage @react-native-clipboard/clipboard @react-native-community/netinfo @react-navigation/elements @react-navigation/stack react-native-bootsplash react-native-device-info react-native-fast-image react-native-fs react-native-gesture-handler react-native-permissions react-native-reanimated react-native-svg react-native-uuid @react-native-voice/voice react-native-blob-util react-native-file-viewer
```

**After installation, don't forget to:**
- Run `cd ios && pod install` for iOS
- Rebuild your app for both platforms

### Usage Example:

```typescript
import React from 'react';
import { View } from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v77';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <KoreChat 
        // ... your bot configuration
      />
    </View>
  );
};

export default App;
```

### Troubleshooting:

If you still encounter native module issues:

1. **Check peer dependencies**: Ensure all peer dependencies are installed in your main app
2. **Metro configuration**: Make sure your metro.config.js includes proper resolution for native modules
3. **Clean build**: Try cleaning your build cache and rebuilding

```bash
# React Native
npx react-native clean
cd ios && pod install && cd ..
npx react-native run-ios
```

### Advanced Configuration:

If you need to customize the native module loading behavior, you can extend the library components and override the initialization logic.

## Permission Setup for Voice Features

If you encounter "Microphone permission denied" errors, this means the voice functionality is working but requires proper permission setup:

### iOS Permissions

Add the following to your `ios/YourProject/Info.plist`:

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

### Android Permissions

Add the following to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

### Permission Troubleshooting

1. **Permission Denied Error**: This is normal behavior when:
   - User denies permission when prompted
   - App doesn't have permission declarations in manifest files
   - Permission was previously denied and is now blocked

2. **Reset Permissions**: 
   - **iOS**: Delete app and reinstall, or go to Settings > Privacy & Security > Microphone
   - **Android**: Go to Settings > Apps > [Your App] > Permissions

3. **Test Permissions**: The library will automatically:
   - ✅ Show voice button when permissions are granted
   - ⚠️ Hide voice button when permissions are denied
   - 🔄 Request permissions when voice button is tapped

### Voice Feature Status

You can monitor voice functionality in the console:

```javascript
// Normal logs when voice is working:
// ✅ "Voice module loaded successfully"
// ✅ "Microphone permission granted"

// Expected logs when voice is unavailable:
// ⚠️ "Voice module not available"
// ⚠️ "Microphone permission denied"
// ⚠️ "Permissions module not available"
```
