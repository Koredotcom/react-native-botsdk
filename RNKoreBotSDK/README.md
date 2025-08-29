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

### 🚀 **Smart Lazy Loading**
- ⚡ **~380KB bundle size reduction**
- 🎵 Optional voice recognition & TTS
- 📁 Optional file upload/download
- 🎬 Optional video/media support
- 🔄 Automatic fallback handling

</td>
</tr>
</table>

## 🎯 **Why Choose This SDK?**

### 📦 **Flexible Installation**
- **Minimal**: Just chat functionality (~380KB saved)
- **Selective**: Pick only features you need (~200-300KB saved)  
- **Full**: Complete experience (standard size)

### ⚡ **Smart Performance**
- Components load **only when needed**
- **Graceful fallbacks** when dependencies missing
- **Zero bundle impact** for unused features
- **Automatic caching** after first load

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

### Step 2: Install Dependencies

The SDK uses **Smart Lazy Loading** to minimize bundle size. Dependencies are categorized into **Required** and **Optional (Lazy-Loaded)** packages:

## 📦 **Required Dependencies** 
*Always needed - install these first:*

```bash
npm install \
  "@react-native-async-storage/async-storage@^2.2.0" \
  "@react-native-community/netinfo@^11.4.1" \
  "@react-native-community/slider@^5.0.1" \
  "@react-navigation/native@^7.1.14" \
  "@react-navigation/stack@^7.4.2" \
  "axios@^1.10.0" \
  "dayjs@^1.11.13" \
  "react-native-blob-util@^0.22.2" \
  "react-native-gesture-handler@^2.27.2" \
  "react-native-linear-gradient@^2.8.3" \
  "react-native-reanimated@3.18.0" \
  "react-native-safe-area-context@^5.4.1" \
  "react-native-screens@^4.13.1" \
  "react-native-svg@^15.12.1" \
  "react-native-vector-icons@^10.2.0" \
  "rn-kore-bot-socket-lib-v77@^0.0.3"
```

## ⚡ **Optional Dependencies (Lazy-Loaded)**
*Install only the features you need:*

<details>
<summary><strong>🎵 Audio Features (~40KB saved)</strong></summary>

**For audio playback in messages:**
```bash
npm install react-native-sound@^0.12.0
```
- Used by: Audio messages, notification sounds
- Lazy loads when: Audio message is first played
- Fallback: Silent mode (no audio playback)

</details>

<details>
<summary><strong>🎤 Voice Features (~40KB saved)</strong></summary>

**For voice recognition and text-to-speech:**
```bash
npm install @react-native-voice/voice@^3.2.4
npm install react-native-tts@^4.1.1
```
- Used by: Voice input, speech-to-text, text-to-speech
- Lazy loads when: Voice button is first pressed
- Fallback: Voice buttons hidden, text input only

</details>

<details>
<summary><strong>📅 Date/Time Picker (~30KB saved)</strong></summary>

**For date/time selection in forms:**
```bash
npm install @react-native-community/datetimepicker@^8.4.4
```
- Used by: Date picker templates, calendar widgets
- Lazy loads when: Date picker is first opened
- Fallback: Text input for dates

</details>

<details>
<summary><strong>🎛️ Picker/Dropdown (~25KB saved)</strong></summary>

**For dropdown selections:**
```bash
npm install @react-native-picker/picker@^2.11.0
```
- Used by: Dropdown templates, selection lists
- Lazy loads when: Dropdown is first opened
- Fallback: Basic button selection

</details>

<details>
<summary><strong>📞 Communications (~15KB saved)</strong></summary>

**For phone/SMS/email actions:**
```bash
npm install react-native-communications@^2.2.1
```
- Used by: Contact templates, phone/email buttons
- Lazy loads when: Contact action is first triggered
- Fallback: Basic device linking (tel:, mailto:, sms:)

</details>

<details>
<summary><strong>📷 Media Features</strong></summary>

**For image/document handling:**
```bash
npm install react-native-image-picker@^8.2.1
npm install react-native-document-picker@^9.3.1
npm install react-native-fast-image@^8.6.3
```
- Used by: File attachments, image uploads, media display
- Lazy loads when: Media feature is first used
- Fallback: Basic image display, disabled upload

</details>

<details>
<summary><strong>🎬 Video Playback (~60KB saved)</strong></summary>

**For video messages:**
```bash
npm install react-native-video@^6.16.1
```
- Used by: Video message templates
- Lazy loads when: Video is first played
- Fallback: Static thumbnail with play button

</details>

<details>
<summary><strong>🎠 Carousel (~55KB saved)</strong></summary>

**For carousel/slider templates:**
```bash
npm install react-native-reanimated-carousel@^4.0.3
```
- Used by: Carousel templates, image sliders
- Lazy loads when: Carousel is first displayed
- Fallback: Vertical list layout

</details>

<details>
<summary><strong>📄 Text Parsing (~15KB saved)</strong></summary>

**For rich text with links/phones/emails:**
```bash
npm install react-native-parsed-text@^0.0.22
```
- Used by: Rich text messages, link detection
- Lazy loads when: Rich text is first displayed  
- Fallback: Plain text display

</details>

<details>
<summary><strong>🎨 UI Enhancements</strong></summary>

**For enhanced UI components:**
```bash
npm install react-native-paper@^5.14.5
npm install react-native-popover-view@^6.1.0
npm install react-native-shadow-2@^7.1.0
npm install react-native-toast-message@^2.3.0
```
- Used by: Enhanced buttons, popovers, shadows, notifications
- Lazy loads when: Component is first used
- Fallback: Modal-based alternatives

</details>

## 💡 **Bundle Size Impact**

| Installation Type | Initial Bundle | Total Possible | Savings |
|------------------|----------------|----------------|---------|
| **Minimal** (Required only) | Base size | Base + 0KB | **~380KB saved** |
| **Selective** (Pick features) | Base + chosen | Base + ~50-150KB | **~200-300KB saved** |
| **Full** (All optional) | Base + all | Base + ~380KB | Standard experience |

## 🎯 **Smart Installation Examples**

**Basic Chat Only:**
```bash
# Just install required dependencies
# Total savings: ~380KB
```

**Chat + Voice:**
```bash
npm install @react-native-voice/voice react-native-tts
# Total savings: ~340KB
```

**Chat + Media:**
```bash
npm install react-native-image-picker react-native-document-picker react-native-fast-image
# Total savings: ~300KB  
```

**Full Features:**
```bash
# Install all optional dependencies for complete experience
# Use this for full-featured implementations
```

<details>
<summary><strong>📋 Sample App Dependencies (Optional)</strong></summary>

```bash
npm install \
  "@react-native-async-storage/async-storage@^2.2.0" \
  "@react-native-clipboard/clipboard@^1.16.2" \
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

### 🚀 Smart Lazy Loading System

The SDK features an intelligent lazy loading system that loads dependencies only when needed:

#### How It Works
```tsx
// ✅ Components load on-demand when first used
// ⚠️ Graceful fallbacks when dependencies are missing  
// 🔄 Automatic caching after first load
// 📊 Real-time loading indicators for better UX
```

#### Lazy Loading Components Available
```tsx
import { 
  LazySound, useLazySound,           // Audio playback
  LazyTTS, useLazyTTS,               // Text-to-speech
  LazyVoice, useLazyVoice,           // Voice recognition
  LazyPicker, useLazyPicker,         // Dropdowns/selections
  LazyDateTimePicker,                // Date/time pickers
  LazyVideo, useLazyVideo,           // Video playback
  LazyPopover, useLazyPopover,       // Popover menus
  LazyCommunications,                // Phone/SMS/email
  LazyParsedText,                    // Rich text parsing
} from 'rn-kore-bot-sdk-v77';
```

#### Loading States & Fallbacks

| Component | Loading State | Fallback Behavior |
|-----------|---------------|------------------|
| **Audio** | "Loading audio..." | Silent mode |
| **Voice** | "Loading voice..." | Text input only |
| **Video** | "Loading video..." | Static thumbnail |
| **Picker** | "Loading options..." | Button selection |
| **Popover** | "Loading popover..." | Modal fallback |
| **Communications** | "Loading contacts..." | Basic device linking |

#### Console Logs for Debugging

```javascript
// ✅ Success logs
"LazySound: Sound module loaded successfully"
"LazyVoice: Voice recognition available"
"LazyTTS: Text-to-speech ready"

// ⚠️ Warning logs (non-breaking)
"LazySound: react-native-sound not installed, using fallback"
"LazyVoice: Voice module not available, hiding voice button"
"LazyVideo: Video player unavailable, showing static content"

// ℹ️ Info logs
"LazyPicker: Loading picker module..."
"LazyCommunications: Module cached, instant load"
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

## 📋 **Complete Dependency Reference**

### 🔧 **Required Dependencies** (Always Install)
| Package | Version | Purpose | Size Impact |
|---------|---------|---------|-------------|
| `@react-native-async-storage/async-storage` | `^2.2.0` | Chat history, settings storage | Required |
| `@react-native-community/netinfo` | `^11.4.1` | Network connectivity detection | Required |
| `@react-native-community/slider` | `^5.0.1` | Audio/video progress controls | Required |
| `@react-navigation/native` | `^7.1.14` | Navigation framework | Required |
| `@react-navigation/stack` | `^7.4.2` | Stack navigation | Required |
| `axios` | `^1.10.0` | HTTP requests | Required |
| `dayjs` | `^1.11.13` | Date/time formatting | Required |
| `react-native-blob-util` | `^0.22.2` | File operations | Required |
| `react-native-gesture-handler` | `^2.27.2` | Touch gestures | Required |
| `react-native-linear-gradient` | `^2.8.3` | UI gradients | Required |
| `react-native-reanimated` | `3.18.0` | Animations | Required |
| `react-native-safe-area-context` | `^5.4.1` | Safe area handling | Required |
| `react-native-screens` | `^4.13.1` | Native screen optimization | Required |
| `react-native-svg` | `^15.12.1` | SVG icon rendering | Required |
| `react-native-vector-icons` | `^10.2.0` | Icon library | Required |
| `rn-kore-bot-socket-lib-v77` | `^0.0.3` | WebSocket communication | Required |

### ⚡ **Optional Dependencies** (Lazy-Loaded)
| Package | Version | Bundle Size | Features Enabled | Fallback Behavior |
|---------|---------|-------------|------------------|-------------------|
| **🎵 Audio & Voice** |
| `react-native-sound` | `^0.12.0` | ~40KB | Audio message playback | Silent mode |
| `@react-native-voice/voice` | `^3.2.4` | ~40KB | Voice-to-text input | Voice button hidden |
| `react-native-tts` | `^4.1.1` | ~45KB | Text-to-speech output | No TTS playback |
| **📅 Form Components** |
| `@react-native-picker/picker` | `^2.11.0` | ~25KB | Native dropdowns | Button selection |
| `@react-native-community/datetimepicker` | `^8.4.4` | ~30KB | Native date/time pickers | Text input |
| **📱 Communications** |
| `react-native-communications` | `^2.2.1` | ~15KB | Native phone/SMS/email | Basic device linking |
| **🎬 Media & Rich Content** |
| `react-native-video` | `^6.16.1` | ~60KB | Video message playback | Static thumbnails |
| `react-native-reanimated-carousel` | `^4.0.3` | ~55KB | Carousel templates | Vertical list |
| `react-native-parsed-text` | `^0.0.22` | ~15KB | Rich text with links | Plain text |
| `react-native-image-picker` | `^8.2.1` | ~50KB | Camera/gallery access | Upload disabled |
| `react-native-document-picker` | `^9.3.1` | ~35KB | File picker | Upload disabled |
| `react-native-fast-image` | `^8.6.3` | ~25KB | Optimized image loading | Basic Image component |
| **🎨 UI Enhancements** |
| `react-native-paper` | `^5.14.5` | ~30KB | Material Design components | Basic RN components |
| `react-native-popover-view` | `^6.1.0` | ~20KB | Popover menus | Modal fallback |
| `react-native-shadow-2` | `^7.1.0` | ~10KB | Advanced shadows | Basic shadows |
| `react-native-toast-message` | `^2.3.0` | ~15KB | Toast notifications | Alert fallback |

### 🎯 **Installation Templates**

**Minimal Chat (Base + 0KB):**
```bash
# Only required dependencies - maximum savings
```

**Basic Chat + Voice (Base + 85KB):**
```bash
npm install @react-native-voice/voice react-native-tts
```

**Chat + Media (Base + 170KB):**
```bash
npm install react-native-image-picker react-native-document-picker react-native-fast-image react-native-video
```

**Full Featured (Base + 380KB):**
```bash
# Install all optional dependencies
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
