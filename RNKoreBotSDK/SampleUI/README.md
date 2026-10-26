# SampleUI — RN Kore Bot SDK integration sample

`SampleUI` is a working React Native 0.79 sample application that demonstrates how an external application can integrate `rn-kore-bot-sdk-v79`.

[![NPM Version](https://img.shields.io/npm/v/rn-kore-bot-sdk-v79.svg?style=flat-square)](https://www.npmjs.com/package/rn-kore-bot-sdk-v79)
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-lightgrey.svg?style=flat-square)](https://github.com/your-repo/react-native-kore-bot-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your-repo/react-native-kore-bot-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

## Requirements

- Node.js 18 or later
- React Native `0.79.x`
- React `19.x`
- Xcode and CocoaPods for iOS, or Android Studio and the Android SDK for Android

## Run this sample

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
import KoreChat, { BotConfigModel } from 'rn-kore-bot-sdk-v79';

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
npm install
cd ios && pod install && cd ..
npx react-native start --reset-cache
```

In another terminal:

```bash
npx react-native run-ios
# or
npx react-native run-android
```

The sample uses the SDK from the parent directory through `rn-kore-bot-sdk-v79: "file:.."`. Its [Metro configuration](metro.config.js) is only for this local linked-package setup.

## Integrate the SDK in an external application

### 1. Install the package

```bash
npm install rn-kore-bot-sdk-v79
cd ios && pod install && cd ..
```

Use React 19 and React Native 0.79.x in the external application. Do not install a v77 UI package or socket library alongside this SDK.

### 2. Configure the host application

## 🎯 Basic Usage

### Simple Integration

```tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import KoreChat, { BotConfigModel, ThemeProvider } from 'rn-kore-bot-sdk-v79';

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

```js
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

```tsx
import { ThemeProvider } from 'rn-kore-bot-sdk-v79';

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
import { CustomTemplate } from 'rn-kore-bot-sdk-v79';

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

### 3. Configure the bot

The sample configuration is in [`src/config/BotConfig.tsx`](src/config/BotConfig.tsx). Replace its placeholder values with environment-specific values and do not commit real secrets:

```tsx
import type {BotConfigModel} from 'rn-kore-bot-sdk-v79';

export const botConfig: BotConfigModel = {
  botName: 'Assistant',
  botId: 'your-bot-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  botUrl: 'https://your.server.url',
  jwtServerUrl: 'https://your.jwt.server.url',
  identity: 'unique-user-id',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize',
  isHeaderVisible: true,
  isFooterVisible: true,
};
```

### 4. Render the chat screen

```tsx
import React from 'react';
import {SafeAreaView} from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v79';
import {botConfig} from './config/BotConfig';

```tsx
import { BotException } from 'rn-kore-bot-sdk-v79';

try {
  // Bot operations
} catch (error) {
  if (error instanceof BotException) {
    console.log('Bot error:', error.message);
  }
}
```

For an embedded chat view without navigation, pass `onClose` and manage visibility in the host application. Use `onHeaderActionsClick` only when the host owns the default header actions.

### 5. Configure native permissions

Add the iOS usage descriptions and Android permissions required by the features your external application enables. For voice, camera, photo library, audio, video, and attachments, follow the platform setup in the [root SDK README](../README.md#installation-in-an-external-application).

After changing native dependencies, permissions, or Babel configuration, rebuild the application.

## Sample code locations

- [`src/config/BotConfig.tsx`](src/config/BotConfig.tsx) — sample bot configuration
- [`src/screens/Home/index.tsx`](src/screens/Home/index.tsx) — SDK chat screen integration
- [`src/navigation/AppContainer.tsx`](src/navigation/AppContainer.tsx) — navigation setup
- [`src/botIndex.tsx`](src/botIndex.tsx) — application root and gesture-handler setup

For headers, templates, socket events, lazy capabilities, permissions, supported templates, and troubleshooting, use the [root SDK README](../README.md).
