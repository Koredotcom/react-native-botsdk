<div align="center">

# 🤖 React Native Kore Bot SDK

[![NPM Version](https://img.shields.io/npm/v/rn-kore-bot-sdk-v77.svg?style=flat-square)](https://www.npmjs.com/package/rn-kore-bot-sdk-v77)
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-lightgrey.svg?style=flat-square)](https://github.com/your-repo/react-native-kore-bot-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your-repo/react-native-kore-bot-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

*A comprehensive and feature-rich React Native library for seamless Kore.ai chatbot integration*

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎯 Basic Usage](#-basic-usage)
- [🎨 Customization](#-customization)
- [📚 API Reference](#-api-reference)
- [🛠️ Advanced Configuration](#️-advanced-configuration)
- [🔐 Permissions Setup](#-permissions-setup)
- [📱 Examples](#-examples)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [💬 Support](#-support)

---

## ✨ Features

<table>
<tr>
<td>

### 🎯 **Core Features**
- 🤖 Complete chatbot UI components
- 💬 Rich messaging templates
- 🎨 Fully customizable themes
- 📱 Cross-platform (iOS & Android)
- 🔧 Full TypeScript support

</td>
<td>

### 🚀 **Advanced Features**
- 🎵 Voice recognition & TTS
- 📁 File upload/download
- 📊 Charts & data visualization
- 🔄 Real-time messaging
- 🎭 Custom template injection

</td>
</tr>
</table>

---

## 🚀 Quick Start

Get up and running in minutes:

```tsx
import React from 'react';
import { View } from 'react-native';
import KoreChat, { BotConfigModel } from 'rn-kore-bot-sdk-v77';

const App = () => {
  const botConfig: BotConfigModel = {
    botId: 'your-bot-id',
    chatBotName: 'Assistant',
    serverUrl: 'https://your.server.url',
    brandingAPIUrl: 'https://your.branding.url',
  };

  return (
    <View style={{ flex: 1 }}>
      <KoreChat
        botConfig={botConfig}
        onListItemClick={(item) => console.log('📋 Item clicked:', item)}
        onHeaderActionsClick={(action) => console.log('⚡ Action:', action)}
      />
    </View>
  );
};

export default App;
```

---

## 📦 Installation

### Step 1: Install the Main Package

```bash
npm install rn-kore-bot-sdk-v77
# or
yarn add rn-kore-bot-sdk-v77
```

### Step 2: Install Required Dependencies

<details>
<summary><strong>📱 Core Dependencies (Click to expand)</strong></summary>

```bash
npm install \
  "@react-native-picker/picker@^2.11.1" \
  "@react-native-voice/voice@^3.2.4" \
  "@react-native-community/datetimepicker@^8.4.2" \
  "@react-native-community/netinfo@^11.4.1" \
  "react-native-document-picker@^9.3.1" \
  "react-native-fast-image@^8.6.3" \
  "react-native-fs@^2.20.0" \
  "react-native-gesture-handler@^2.26.0" \
  "react-native-gifted-charts@^1.4.63" \
  "react-native-image-picker@^8.2.1" \
  "react-native-reanimated@^3.18.0" \
  "react-native-reanimated-carousel@^4.0.2" \
  "react-native-svg@^15.12.0" \
  "react-native-tts@^4.1.1" \
  "react-native-video@^6.15.0"
```

</details>

<details>
<summary><strong>📋 Sample App Dependencies (Optional)</strong></summary>

```bash
npm install \
  "@react-native-async-storage/async-storage@^2.2.0" \
  "@react-navigation/elements@^2.5.2" \
  "@react-navigation/stack@^7.4.2" \
  "react-native-bootsplash@^6.3.9" \
  "react-native-orientation-locker@^1.7.0" \
  "react-native-permissions@^5.4.1" \
  "react-native-safe-area-context@^5.5.2" \
  "react-native-screens@^4.11.1"
```

</details>

### Step 3: Platform Setup

<details>
<summary><strong>🍎 iOS Setup</strong></summary>

```bash
cd ios && pod install && cd ..
```

Add to `ios/YourProject/Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice messages</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app uses speech recognition for voice-to-text</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access for attachments</string>
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for photos</string>
```

</details>

<details>
<summary><strong>🤖 Android Setup</strong></summary>

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

</details>

---

## 🎯 Basic Usage

### Simple Integration

```tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import KoreChat, { BotConfigModel, ThemeProvider } from 'rn-kore-bot-sdk-v77';

const App = () => {
  const botConfig: BotConfigModel = {
    botId: 'st-12345678-1234-1234-1234-123456789012',
    chatBotName: 'My Assistant',
    serverUrl: 'https://bots.kore.ai',
    brandingAPIUrl: 'https://bots.kore.ai',
    customerId: 'your-customer-id',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    identity: 'your-user-identity',
    isAnonymous: false,
    isPlatform: true,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KoreChat
        botConfig={botConfig}
        onListItemClick={handleListItemClick}
        onHeaderActionsClick={handleHeaderAction}
      />
    </SafeAreaView>
  );
};

const handleListItemClick = (item: any) => {
  console.log('📋 List item selected:', item);
};

const handleHeaderAction = (action: any) => {
  console.log('⚡ Header action triggered:', action);
};

export default App;
```

---

## 🎨 Customization

### Theme Customization

```tsx
import { ThemeProvider } from 'rn-kore-bot-sdk-v77';

const customTheme = {
  primaryColor: '#007AFF',
  secondaryColor: '#5856D6',
  backgroundColor: '#F2F2F7',
  textColor: '#000000',
  borderColor: '#C7C7CC',
  // Add more theme properties
};

const App = () => (
  <ThemeProvider theme={customTheme}>
    <KoreChat botConfig={botConfig} />
  </ThemeProvider>
);
```

### Custom Templates

```tsx
import { CustomTemplate } from 'rn-kore-bot-sdk-v77';

const MyCustomButton = new CustomTemplate({
  templateType: 'custom-button',
  render: (data, onAction) => (
    <TouchableOpacity
      style={styles.customButton}
      onPress={() => onAction(data.action)}
    >
      <Text>{data.title}</Text>
    </TouchableOpacity>
  ),
});

<KoreChat
  botConfig={botConfig}
  templateInjection={new Map([
    ['custom-button', MyCustomButton]
  ])}
/>
```

---

## 📚 API Reference

### KoreChat Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `botConfig` | `BotConfigModel` | ✅ | Bot configuration object |
| `onListItemClick` | `(item: any) => void` | ❌ | Callback for list item interactions |
| `onHeaderActionsClick` | `(action: any) => void` | ❌ | Callback for header action buttons |
| `templateInjection` | `Map<string, CustomTemplate>` | ❌ | Custom template injection map |
| `themeConfig` | `ThemeConfig` | ❌ | Custom theme configuration |

### BotConfigModel Interface

```tsx
interface BotConfigModel {
  // Required fields
  botId: string;              // Bot identifier
  chatBotName: string;        // Display name for the bot
  serverUrl: string;          // Server URL (without trailing slash)
  brandingAPIUrl: string;     // Branding API URL (without trailing slash)
  
  // Authentication
  customerId?: string;        // Customer identifier
  clientId?: string;          // OAuth client ID
  clientSecret?: string;      // OAuth client secret
  identity?: string;          // User identity
  
  // Configuration
  isAnonymous?: boolean;      // Anonymous user mode
  isPlatform?: boolean;       // Platform integration mode
  enableHistory?: boolean;    // Chat history feature
  allowAttachments?: boolean; // File attachment feature
}
```

---

## 🛠️ Advanced Configuration

### Conditional Native Module Loading

The library implements graceful degradation for native modules:

```tsx
// ✅ Automatic fallback when modules are unavailable
// ⚠️ Logs appropriate warnings for missing features
// 🔄 Continues functioning with reduced capabilities
```

### Error Handling

```tsx
import { BotException } from 'rn-kore-bot-sdk-v77';

try {
  // Bot operations
} catch (error) {
  if (error instanceof BotException) {
    console.log('Bot error:', error.message);
  }
}
```

---

## 🔐 Permissions Setup

### 🎤 Voice Features

The SDK includes voice recognition and text-to-speech capabilities:

#### Permission Status Indicators

| Status | Description | Action Required |
|--------|-------------|-----------------|
| ✅ **Granted** | Voice features available | None |
| ⚠️ **Denied** | Voice button hidden | Check app settings |
| 🔄 **Not Requested** | Will prompt on first use | None |

#### Troubleshooting Voice Issues

<details>
<summary><strong>🔧 Common Voice Problems</strong></summary>

**Problem:** "Microphone permission denied"
**Solution:** 
1. Check Info.plist/AndroidManifest.xml permissions
2. Reset app permissions in device settings
3. Reinstall app to re-trigger permission prompts

**Problem:** Voice button not appearing
**Solution:**
1. Verify `@react-native-voice/voice` installation
2. Check native module linking
3. Rebuild project after adding permissions

</details>

### 📱 Console Logs for Debugging

```javascript
// ✅ Success logs
"Voice module loaded successfully"
"Microphone permission granted"

// ⚠️ Warning logs  
"Voice module not available"
"Microphone permission denied"
"Permissions module not available"
```

---

## 📱 Examples

### 🎯 Sample Application

Explore the complete implementation in the `/SampleApp` directory:

```bash
cd SampleApp
npm install
npx react-native run-ios    # or run-android
```

### 📋 Key Example Files

- `SampleApp/src/config/BotConfig.tsx` - Configuration setup
- `SampleApp/src/screens/Home/index.tsx` - Integration example
- `SampleApp/src/customTemplates/` - Custom template examples

---

### Development Setup

```bash
git clone https://github.com/your-repo/react-native-kore-bot-sdk.git
cd react-native-kore-bot-sdk
npm install
```

### 🚀 Quick Commands

```bash
npm run test          # Run tests
npm run lint          # Lint code
npm run build         # Build library
npm run example       # Run example app
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

<div align="center">

### Need Help?

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/your-repo/react-native-kore-bot-sdk/issues)
[![Documentation](https://img.shields.io/badge/Docs-Read%20More-blue?style=for-the-badge&logo=gitbook)](https://docs.kore.ai)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-Ask%20Question-orange?style=for-the-badge&logo=stackoverflow)](https://stackoverflow.com/questions/tagged/kore-ai)

**Found a bug?** [Open an issue](https://github.com/your-repo/react-native-kore-bot-sdk/issues/new)
**Have a question?** [Start a discussion](https://github.com/your-repo/react-native-kore-bot-sdk/discussions)
**Need enterprise support?** [Contact Kore.ai](https://kore.ai/contact)

</div>

---

<div align="center">

**Made with ❤️ by the Kore.ai Team**

[![Star this repo](https://img.shields.io/github/stars/your-repo/react-native-kore-bot-sdk?style=social)](https://github.com/your-repo/react-native-kore-bot-sdk)

</div>
