# SampleUI — RN Kore Bot SDK integration sample

`SampleUI` is a working React Native 0.79 sample application that demonstrates how an external application can integrate `rn-kore-bot-sdk-v79`.

The complete SDK feature reference is maintained in the repository root: [SDK README](../README.md). This document intentionally contains only sample-app and external-app integration steps.

## Requirements

- Node.js 18 or later
- React Native `0.79.x`
- React `19.x`
- Xcode and CocoaPods for iOS, or Android Studio and the Android SDK for Android

## Run this sample

From this directory:

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

Wrap the application root with `GestureHandlerRootView` and add the Reanimated Babel plugin:

```js
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

```tsx
import {GestureHandlerRootView} from 'react-native-gesture-handler';

<GestureHandlerRootView style={{flex: 1}}>
  {/* navigation and screens */}
</GestureHandlerRootView>
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

export default function ChatScreen({navigation}: {navigation?: any}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <KoreChat botConfig={botConfig} navigation={navigation} />
    </SafeAreaView>
  );
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
