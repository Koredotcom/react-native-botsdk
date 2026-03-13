# React Native Kore Bot SDK – Integration Guide

Step-by-step guide to integrate the Kore Bot SDK (rn-kore-bot-sdk-v77) into your React Native 0.77 app. **Install all required packages first** (recommended); you can remove packages later if you don’t need that feature. Alternatively, install by feature tier (Minimal / Voice / Full).

---

## What you need

- React Native **0.77.x** and React **18.0.0**
- Node.js **18+**
- A new or existing React Native project

---

## Step 1: Install packages

Add the Kore SDK and supporting packages to **package.json** → **dependencies**. Install everything first so chat, carousel, camera, voice, and file upload work.

**Add (merge with existing):**

```json
"dependencies": {
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-native-community/netinfo": "^11.4.1",
  "@react-native-community/slider": "^5.1.1",
  "@react-native-documents/picker": "^10.1.5",
  "@react-native-picker/picker": "^2.11.4",
  "@react-navigation/elements": "^2.5.2",
  "@react-navigation/native": "^7.1.28",
  "@react-navigation/stack": "^7.4.2",
  "axios": "^1.13.2",
  "dayjs": "^1.11.19",
  "react-native-blob-util": "^0.22.2",
  "react-native-bootsplash": "^6.3.9",
  "react-native-fs": "^2.20.0",
  "react-native-gesture-handler": "^2.26.0",
  "react-native-image-picker": "^8.2.1",
  "react-native-linear-gradient": "^2.8.3",
  "react-native-permissions": "^5.4.1",
  "react-native-reanimated": "3.18.0",
  "react-native-reanimated-carousel": "^4.0.3",
  "react-native-safe-area-context": "^5.5.2",
  "react-native-screens": "4.18.0",
  "react-native-sound": "^0.13.0",
  "react-native-svg": "^15.12.1",
  "react-native-vector-icons": "^10.3.0",
  "react-native-video": "^6.18.0",
  "rn-kore-bot-sdk-v77": "^0.0.5"
}
```

Then run:

```bash
npm install
```

Ensure **peerDependencies** match (React 18.0.0, React Native ^0.77.0). Optional: `"engines": { "node": ">=18" }`.

### Removing packages later (optional)

| If you don't need | You can remove |
|-------------------|----------------|
| Carousel / slider cards | `react-native-reanimated-carousel` |
| Take photo (camera) | `react-native-image-picker` |
| Upload photo / video / file | `@react-native-documents/picker` |
| Video in messages | `react-native-video` |
| Audio in messages | `react-native-sound` |
| Permission prompts | `react-native-permissions` |
| Boot splash | `react-native-bootsplash` |
| Date/time | `dayjs` |
| File access | `react-native-fs`, `react-native-blob-util` |
| Gradients / Icons | `react-native-linear-gradient`, `react-native-vector-icons` |

**Do not remove:** `rn-kore-bot-sdk-v77`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`, `@react-navigation/*`, `axios`, `react-native-svg`.

### Alternative: Install by feature tier

**Option A – Minimal Chat** (~380KB saved):

```bash
npm install \
  "@react-native-async-storage/async-storage@^2.2.0" \
  "@react-native-community/netinfo@^11.4.1" \
  "@react-navigation/native@^7.1.14" \
  "@react-navigation/stack@^7.4.2" \
  "react-native-gesture-handler@^2.27.2" \
  "react-native-safe-area-context@^5.4.1" \
  "react-native-screens@^4.13.1" \
  "rn-kore-bot-sdk-v77@^0.0.5"
```

**Option B – Chat + Voice** (add after A): `npm install @react-native-voice/voice@^3.2.4 react-native-tts@^4.1.1 react-native-permissions@^5.4.1`

**Option C – Full** – use the full dependency list in Step 1 above.

### Feature comparison

| Feature | Minimal | Voice | Full |
|--------|---------|-------|------|
| Bundle size | Base | Base + ~80KB | Base + ~380KB |
| Chat | ✅ | ✅ | ✅ |
| Voice input | ❌ | ✅ | ✅ |
| Audio playback | ❌ | ✅ | ✅ |
| Video | Thumbnail | Thumbnail | Full player |
| File uploads | ❌ | ❌ | ✅ |
| Rich templates | Basic | Basic | Advanced |

---

## Step 2: React Native config

Create **react-native.config.js** in the project root:

```javascript
module.exports = {
  dependencies: {
    'rn-kore-bot-sdk-v77': { platforms: { android: null, ios: {} } },
  },
};
```

Adjust package names if different in your project.

---

## Step 3: Babel (required for Carousel)

In **babel.config.js**, add the Reanimated plugin **last**:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

Without this, Carousel won’t work. Then: `npx react-native start --reset-cache` and rebuild.

---

## Step 4: iOS (CocoaPods)

```bash
cd ios && pod install && cd ..
```

If using **react-native-permissions** (Camera, PhotoLibrary, Microphone, SpeechRecognition), ensure the Podfile calls `setup_permissions([...])` before `pod install`.

---

## Step 5: Add Kore Chat and register app

**1. Create `src/index.tsx`** (or `src/index.js`) with your app and Kore Chat. Replace `botConfig` with your Kore.ai values.

```tsx
// src/index.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v77';

const botConfig = {
  botName: 'YourBot',
  botId: 'your-bot-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  botUrl: 'https://bots.kore.ai',
  identity: 'your-user-identity',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize',
  jwtServerUrl: 'your-jwt-server-url-if-needed',
  isHeaderVisible: true,
  isFooterVisible: true,
};

export default function App() {
  const chatContent = (
    <SafeAreaView style={{ flex: 1 }}>
      <KoreChat botConfig={botConfig} alwaysShowSend={true} />
    </SafeAreaView>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
          {chatContent}
        </KeyboardAvoidingView>
      ) : (
        chatContent
      )}
    </GestureHandlerRootView>
  );
}
```

**2. Register in `index.js`** (project root):

```javascript
// index.js
import { AppRegistry } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

Optional: move `botConfig` to **src/config/BotConfig.tsx** and use env vars for secrets. Optional: request microphone (or other) permissions at startup with **react-native-permissions**.

---

## Step 6: Permissions

<details>
<summary><strong>🍎 iOS</strong></summary>

In **ios/YourAppName/Info.plist** (inside the main `<dict>`):

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
<summary><strong>🤖 Android</strong></summary>

In **android/app/src/main/AndroidManifest.xml** (inside `<manifest>`):

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

</details>

---

## Step 7: Build and run

- **iOS:** `npm run ios` (or open **.xcworkspace** in Xcode).
- **Android:** `npm run android`.

After Babel or native changes: `npx react-native start --reset-cache`, then build again.

---

## Quick checklist

1. Step 1: Add dependencies → `npm install`
2. Step 2: Add **react-native.config.js**
3. Step 3: Add **react-native-reanimated/plugin** to **babel.config.js**
4. Step 4: `cd ios && pod install && cd ..`
5. Step 5: Add **src/index.tsx** and **index.js** (Kore Chat + registration)
6. Step 6: Add iOS/Android permissions
7. Step 7: Build and run

---

## Usage and reference

### Alternative botConfig (serverUrl, customerId, etc.)

Your SDK may accept different keys. Example with `serverUrl`, `brandingAPIUrl`, `customerId`:

```tsx
const botConfig = {
  botId: 'st-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
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
```

### Customization (if supported by SDK)

**Theme:**

```tsx
import { ThemeProvider } from 'rn-kore-bot-sdk-v77';

const customTheme = {
  primaryColor: '#007AFF',
  secondaryColor: '#5856D6',
  backgroundColor: '#F2F2F7',
  textColor: '#000000',
  borderColor: '#C7C7CC',
};

<ThemeProvider theme={customTheme}>
  <KoreChat botConfig={botConfig} />
</ThemeProvider>
```

**Custom templates:**

```tsx
import { CustomTemplate } from 'rn-kore-bot-sdk-v77';

const MyCustomButton = new CustomTemplate({
  templateType: 'custom-button',
  render: (data, onAction) => (
    <TouchableOpacity onPress={() => onAction(data.action)}>
      <Text>{data.title}</Text>
    </TouchableOpacity>
  ),
});

<KoreChat botConfig={botConfig} templateInjection={new Map([['custom-button', MyCustomButton]])} />
```

### API reference

**KoreChat props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `botConfig` | `BotConfigModel` | ✅ | Bot configuration |
| `onListItemClick` | `(item: any) => void` | ❌ | List item callback |
| `onHeaderActionsClick` | `(action: any) => void` | ❌ | Header action callback |
| `templateInjection` | `Map<string, CustomTemplate>` | ❌ | Custom templates |
| `themeConfig` | `ThemeConfig` | ❌ | Theme overrides |

**BotConfigModel (main fields)**

- Required: `botId`, `chatBotName` (or `botName`), `serverUrl` (or `botUrl`), optional `brandingAPIUrl`
- Auth: `customerId`, `clientId`, `clientSecret`, `identity`
- Config: `isAnonymous`, `isPlatform`, `enableHistory`, `allowAttachments`

### Error handling

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

The SDK may degrade gracefully when optional native modules are missing (fallbacks, console warnings).

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Carousel stuck on "Loading carousel…" | Add `react-native-reanimated/plugin` as the **last** plugin in **babel.config.js**, then `npx react-native start --reset-cache` and rebuild. |
| Take photo / Upload photo not working | Add **react-native-image-picker**. On iOS: Podfile `setup_permissions` (Camera, PhotoLibrary) and Info.plist usage descriptions. |
| iOS: "No iOS permission microphone permission handler detected" | Podfile: `setup_permissions([..., 'Microphone', 'SpeechRecognition'])`, then `cd ios && pod install`. |
| iOS keyboard covers input | Wrap chat in **KeyboardAvoidingView** with `behavior="padding"` (see Step 5). |
| White screen or no chat | Check **botConfig** (URLs, credentials) and that the component using **KoreChat** is the one registered in **index.js**. |

**Voice:** Granted → features on. Denied → voice button hidden; check app settings. Not requested → will prompt on first use. If voice button missing: ensure voice/TTS packages are installed and linked, then rebuild.

**Console:** Success – e.g. "Voice module loaded successfully". Warnings – e.g. "Voice module not available", "Microphone permission denied".

---

## Testing and pro tips

- Install all deps first, then run `npm install` and `npx react-native run-ios` (or `run-android`).
- Test without optional deps to see fallbacks (e.g. "Voice not available", silent audio).
- Add voice/full packages incrementally and rebuild.
- Start minimal; check console for lazy loading; test on device for bundle size.

---

## Version reference

| Item | Version |
|------|---------|
| React Native | ^0.77.0 |
| React | 19.0.0 |
| rn-kore-bot-sdk-v77 | ^0.0.5 |
| Node | >= 18 |

Check the SDK **peerDependencies** and release notes for current versions.
