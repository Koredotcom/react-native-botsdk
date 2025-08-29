<div align="center">

# 🤖 React Native Kore Bot SDK - Sample App

[![NPM Version](https://img.shields.io/npm/v/rn-kore-bot-sdk-v77.svg?style=flat-square)](https://www.npmjs.com/package/rn-kore-bot-sdk-v77)
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-lightgrey.svg?style=flat-square)](https://github.com/your-repo/react-native-kore-bot-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your-repo/react-native-kore-bot-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

*Complete sample implementation demonstrating Kore.ai chatbot integration with selective feature loading*

## 🎯 **What's This?**
This sample app showcases how to integrate the Kore Bot SDK with **selective dependency installation**, allowing you to choose only the features you need and save significant bundle size.

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

## 📦 Sample App Installation

### Step 1: Clone & Install Base

```bash
git clone <repository-url>
cd SampleApp
npm install
```

### Step 2: Choose Your Features

This sample app demonstrates **3 different installation approaches**:

## 🎯 **Installation Options**

### Option A: 🚀 **Minimal Chat** (~380KB saved)
*Perfect for basic chat functionality*

```bash
# Only install required dependencies
npm install \
  "@react-native-async-storage/async-storage@^2.2.0" \
  "@react-native-community/netinfo@^11.4.1" \
  "@react-navigation/native@^7.1.14" \
  "@react-navigation/stack@^7.4.2" \
  "react-native-gesture-handler@^2.27.2" \
  "react-native-safe-area-context@^5.4.1" \
  "react-native-screens@^4.13.1"
```

**Features Available:**
- ✅ Basic chat interface  
- ✅ Text messaging
- ✅ Simple templates
- ❌ Voice features (buttons hidden)
- ❌ Audio playback (silent mode)
- ❌ Video content (static thumbnails)

### Option B: 🎤 **Chat + Voice** (~300KB saved)
*Adds voice recognition and TTS*

```bash
# Install minimal + voice features
npm install \
  "@react-native-voice/voice@^3.2.4" \
  "react-native-tts@^4.1.1" \
  "react-native-permissions@^5.4.1"
```

**Additional Features:**
- ✅ Voice-to-text input
- ✅ Text-to-speech playback
- ✅ Microphone permissions handling

### Option C: 📱 **Full Experience** (Complete features)
*Install all optional dependencies*

```bash
# Complete feature set
npm install \
  "@react-native-picker/picker@^2.11.0" \
  "@react-native-voice/voice@^3.2.4" \
  "@react-native-community/datetimepicker@^8.4.4" \
  "react-native-communications@^2.2.1" \
  "react-native-document-picker@^9.3.1" \
  "react-native-fast-image@^8.6.3" \
  "react-native-image-picker@^8.2.1" \
  "react-native-parsed-text@^0.0.22" \
  "react-native-popover-view@^6.1.0" \
  "react-native-reanimated-carousel@^4.0.3" \
  "react-native-sound@^0.12.0" \
  "react-native-tts@^4.1.1" \
  "react-native-video@^6.16.1"
```

**All Features:**
- ✅ Everything from Options A & B
- ✅ Rich media support (images, videos, audio)
- ✅ Advanced templates (carousels, pickers)
- ✅ File attachments
- ✅ Enhanced UI components

## 📊 **Feature Comparison**

| Feature | Minimal | Voice | Full |
|---------|---------|-------|------|
| **Bundle Size** | Base | Base + 80KB | Base + 380KB |
| **Savings** | 380KB | 300KB | 0KB |
| **Chat Interface** | ✅ | ✅ | ✅ |
| **Voice Input** | ❌ | ✅ | ✅ |
| **Audio Playback** | ❌ | ✅ | ✅ |
| **Video Messages** | 📷 Thumbnail | 📷 Thumbnail | ▶️ Full Player |
| **File Uploads** | ❌ | ❌ | ✅ |
| **Rich Templates** | Basic | Basic | Advanced |
| **Phone/Email Actions** | Basic | Basic | Native |

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

## 📱 Testing Different Configurations

### 🧪 **How to Test Each Configuration**

1. **Start with Minimal Installation:**
```bash
# Install only required dependencies
npm install # (just the minimal set)
npx react-native run-ios
```

2. **Test Lazy Loading Behavior:**
```bash
# Try using features without dependencies installed
# - Tap voice button → See "Voice not available" message
# - Play audio → See silent mode
# - Open video → See static thumbnail
```

3. **Add Features Incrementally:**
```bash
# Add voice features
npm install @react-native-voice/voice react-native-tts
npx react-native run-ios

# Now voice buttons should appear and work
```

### 🔍 **Debugging Lazy Loading**

**Check Console Logs:**
```javascript
// Look for these messages in your console:
"LazySound: react-native-sound not installed, using fallback"
"LazyVoice: Voice module loaded successfully"  
"LazyVideo: Loading video player..."
```

**Visual Indicators:**
- 🔄 Loading spinners when modules are loading
- ⚠️ Warning messages for missing dependencies
- ✅ Success indicators when features are ready

### 📋 **Key Sample Files**

- `src/config/BotConfig.tsx` - Configuration setup
- `src/screens/Home/index.tsx` - Integration example  
- `src/screens/TestFeatures.tsx` - Feature testing screen
- `src/components/LazyComponents/` - Lazy loading examples

### 🎯 **Sample Application**

Run the complete sample:

```bash
cd SampleApp
npm install
npx react-native run-ios    # or run-android
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

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

## 🎯 **Quick Start Guide**

1. **Choose your approach** from the 3 installation options above
2. **Install dependencies** for your chosen features
3. **Run the app**: `npx react-native run-ios`
4. **Test lazy loading** by trying features without dependencies
5. **Add more features** incrementally as needed

## 💡 **Pro Tips**

- **Start minimal** and add features as you need them
- **Check console logs** to see lazy loading in action
- **Test on device** for realistic bundle size impact
- **Use fallback components** to handle missing dependencies gracefully

---

**Made with ❤️ by the Kore.ai Team**

[![Star this repo](https://img.shields.io/github/stars/your-repo/react-native-kore-bot-sdk?style=social)](https://github.com/your-repo/react-native-kore-bot-sdk)

</div>
