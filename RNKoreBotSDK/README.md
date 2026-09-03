# rn-kore-bot-sdk-v79

React Native chatbot UI SDK for React Native **0.79.x** and React **19.x**.

The SDK provides a complete Kore.ai chat experience for iOS and Android, including rich message templates, real-time messaging, theming, attachments, voice, media, charts, and custom template injection.

## Compatibility

| SDK package | React Native | React |
| --- | --- | --- |
| `rn-kore-bot-sdk-v79` | `>=0.79.0 <0.80.0` | `19.x` |

Do not mix this SDK with the v77 UI package, socket library, or Android project. The host application must use the matching React Native 0.79 toolchain.

### Requirements

- Node.js 18 or later
- React Native 0.79.x
- React 19.x
- Xcode and CocoaPods for iOS, or Android Studio and the Android SDK for Android

## Features

### Core features

- Complete chatbot UI for iOS and Android
- Real-time Kore.ai socket messaging
- Text messages, quick replies, buttons, links, lists, tables, cards, and carousels
- Customizable header, footer, colors, typography, and branding
- TypeScript support and exported SDK types
- Back, close, help, live-agent, minimize, expand, and reconnect actions
- History, typing indicators, connection state, and network reconnect handling

### Rich templates and UI

- Image, audio, video, and link messages
- Lists, advanced lists, list widgets, table lists, tables, and mini tables
- Carousels, buttons, quick replies, dropdowns, radio options, and multi-select
- Date, date-range, clock, feedback, form, digital form, OTP, and reset-pin templates
- Article, answer, error, live-agent, and system templates
- Bar, pie, line, and stacked-bar charts
- Custom templates through `templateInjection`

### Optional capability modules

The SDK lazy-loads several native modules and provides fallbacks when a module is unavailable. Install and configure the corresponding dependency when the feature is required:

| Capability | Package or packages |
| --- | --- |
| Voice input | `@react-native-voice/voice` |
| Text-to-speech | `react-native-tts` |
| Audio playback | `react-native-sound` |
| Video playback | `react-native-video` |
| Camera and image selection | `react-native-image-picker` |
| Document selection | `@react-native-documents/picker` |
| Native picker | `@react-native-picker/picker` |
| Date and time picker | `@react-native-community/datetimepicker` |
| File upload and file access | `react-native-blob-util`, `react-native-fs` |
| Phone, SMS, and email actions | `react-native-communications` |

The published SDK declares its runtime dependencies. After installing the SDK, run the native setup and rebuild the application.

## Installation in an external application

### 1. Install the SDK

```bash
npm install rn-kore-bot-sdk-v79
cd ios && pod install && cd ..
```

If you use Yarn:

```bash
yarn add rn-kore-bot-sdk-v79
cd ios && pod install && cd ..
```

Rebuild the application after installing native dependencies. Do not use a package manager override that installs a second React or React Native version.

### 2. Configure the host application

The root application must be wrapped in `GestureHandlerRootView` when gesture-handler features are used. The host Babel configuration must also include the Reanimated plugin as the last plugin:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

Example root wrapper:

```tsx
import React from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1}}>{/* application navigation */}</View>
    </GestureHandlerRootView>
  );
}
```

### 3. Add iOS permissions

Add the permissions required by the features used by your application to `ios/<AppName>/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for attachments.</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice messages.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app uses speech recognition for voice-to-text.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access for attachments.</string>
```

If using `react-native-permissions`, configure the permission handlers in the Podfile and run `pod install` again.

### 4. Add Android permissions

Add only the permissions required by the enabled features to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

Request dangerous permissions at runtime and rebuild after changing native dependencies or the manifest.

## Basic usage

`BotConfigModel` is a TypeScript type. Import it with `import type` so it is not emitted as a runtime import.

```tsx
import React from 'react';
import {SafeAreaView} from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v79';
import type {BotConfigModel} from 'rn-kore-bot-sdk-v79';

const botConfig: BotConfigModel = {
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

export default function ChatScreen({navigation}: {navigation?: any}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <KoreChat botConfig={botConfig} navigation={navigation} />
    </SafeAreaView>
  );
}
```

`BotConfigModel` fields:

| Field | Required | Description |
| --- | --- | --- |
| `botName` | Yes | Display name for the bot |
| `botId` | Yes | Kore.ai bot identifier |
| `clientId` | Yes | Client ID used for authentication |
| `clientSecret` | Yes | Client secret used for authentication |
| `botUrl` | Yes | Kore.ai server URL; do not add a trailing slash |
| `identity` | Yes | Unique user identity |
| `jwtServerUrl` | Yes | Server endpoint that returns the JWT |
| `isWebHook` | Yes | Enables webhook messaging when `true` |
| `value_aud` | Yes | JWT audience value |
| `isHeaderVisible` | Yes | Shows or hides the default header |
| `isFooterVisible` | Yes | Shows or hides the default footer |
| `jwtToken` | No | Existing JWT token, when applicable |

Do not commit real client secrets or tokens. Load sensitive values from a secure configuration service or environment-specific configuration.

## Header and navigation actions

The default header supports Back, Close, Help, Live Agent, Minimize, Expand, and Reconnect actions. Pass `navigation` to allow the default close action to navigate back. For an embedded chat view without navigation, use `onClose`:

```tsx
<KoreChat botConfig={botConfig} onClose={() => setChatVisible(false)} />
```

Use `onHeaderActionsClick` only when the host application wants to own the action behavior:

```tsx
import KoreChat, {HeaderIconsId} from 'rn-kore-bot-sdk-v79';

const onHeaderActionsClick = (action: string) => {
  switch (action) {
    case HeaderIconsId.CLOSE:
      setChatVisible(false);
      break;
    case HeaderIconsId.RECONNECT:
      // Call the socket client's reconnect method if the host owns reconnects.
      break;
  }
};

<KoreChat
  botConfig={botConfig}
  onHeaderActionsClick={onHeaderActionsClick}
/>
```

If `renderChatHeader` is supplied, the default header and its action handling are bypassed. The custom header must implement its own interactions.

## Custom templates

Custom templates can be supplied through a `Map` keyed by the template type used by the bot response:

```tsx
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v79';

function CustomButton({title, onPress}: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

<KoreChat
  botConfig={botConfig}
  templateInjection={new Map([
    ['custom-button', CustomButton],
  ])}
/>
```

The SDK exports `TEMPLATE_TYPES` for the built-in template identifiers. Custom components should follow the prop contract expected by the injected template and preserve the chat callback behavior.

## Socket events and connection state

The socket client and event names are available from the SDK package:

```tsx
import {KoreBotClient, RTM_EVENT} from 'rn-kore-bot-sdk-v79';

const client = KoreBotClient.getInstance();

client.on(RTM_EVENT.CONNECTING, () => console.log('connecting'));
client.on(RTM_EVENT.ON_OPEN, data => console.log('connected', data));
client.on(RTM_EVENT.ON_MESSAGE, message => console.log('message', message));
client.on(RTM_EVENT.ON_EVENTS, event => console.log('event', event));
client.on(RTM_EVENT.ON_ERROR, error => console.warn('socket error', error));

// Use only when the host explicitly owns reconnect behavior.
client.reconnect(true, true);
```

Available event groups include connecting, authenticated, open, disconnect, close, error, message, failure, reconnecting, acknowledgment, JWT authorization, and history events. The SDK registers listeners required to render messages and typing state. Register host listeners once and remove only those listeners when the host screen unmounts; do not call `removeAllListeners()` from the host application.

## Theming and branding

The SDK loads branding and applies the active theme to the chat UI. A host application can control the surrounding screen color through the `statusBarColor` callback and can provide a custom header or footer when it needs complete layout control.

For custom theme behavior, use the exported theme types and keep the `KoreChat` component inside the SDK's theme provider boundary. Do not call SDK theme hooks from components rendered outside that provider.

## Lazy loading and fallback behavior

Optional capabilities are loaded only when used. The SDK exposes lazy components and fallbacks for communications, date/time picker, document picker, image picker, picker, popover, carousel, sound, TTS, video, and voice features.

When a native package is missing, the chat remains usable with reduced functionality. Typical behavior is:

- Voice button or voice input is unavailable.
- Audio uses the fallback behavior.
- Video content can render a fallback instead of the player.
- Picker, document, date, or communication actions show the fallback behavior.

After adding any native package, run iOS Pods installation or rebuild Android so autolinking takes effect.

## Feature profiles

The published package includes the SDK runtime dependencies. These profiles are useful when maintaining a custom SDK build or when deciding which native capabilities to enable in the host application:

| Profile | Includes | Additional native capabilities |
| --- | --- | --- |
| Base chat | Text, quick replies, buttons, basic templates, themes, socket messaging | None |
| Chat + voice | Base chat | `@react-native-voice/voice`, `react-native-tts`, microphone permissions |
| Full experience | Base chat + voice | Media, attachments, pickers, communications, charts, and advanced templates |

For a custom minimal installation, keep the base dependencies and add only the native packages required by the features in the [optional capability modules](#optional-capability-modules) table. The published package's declared dependencies should not be removed from a normal npm installation without maintaining a matching custom package.

## API reference

### `KoreChat` props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `botConfig` | `BotConfigModel` | Yes | Bot and authentication configuration |
| `navigation` | `any` | No | Navigation object used by default close/back behavior |
| `onClose` | `() => void` | No | Callback for embedded chat close behavior |
| `alwaysShowSend` | `boolean` | No | Keeps the send control visible |
| `initialText` | `string` | No | Initial composer text |
| `textInputProps` | `object` | No | Native text-input overrides |
| `onSend` | `function` | No | Host send callback override |
| `onInputTextChanged` | `function` | No | Composer text change callback |
| `onListItemClick` | `function` | No | List or template item callback |
| `onLongPress` | `function` | No | Message long-press callback |
| `renderInputToolbar` | `function` | No | Custom input toolbar |
| `renderComposer` | `function` | No | Custom composer |
| `renderSend` | `function` | No | Custom send control |
| `renderChatFooter` | `function` | No | Custom chat footer |
| `renderTypingIndicator` | `function` | No | Custom typing indicator |
| `renderChatHeader` | `function` | No | Replaces the default header |
| `renderQuickRepliesView` | `function` | No | Custom quick-replies view |
| `templateInjection` | `Map<string, Component>` | No | Custom template map |
| `scrollToBottom` | `boolean` | No | Controls the scroll-to-bottom control |
| `statusBarColor` | `(color: string) => void` | No | Reports the active header color to the host |

The SDK also exports `KoreBotClient`, `RTM_EVENT`, `APP_STATE`, `TEMPLATE_TYPES`, `HeaderIconsId`, `BotTemplate`, `CustomTemplate`, `QuickReplies`, and lazy-loading utilities from the package entry point.

## Testing feature loading

To test a host application with the complete package:

```bash
npm install rn-kore-bot-sdk-v79
cd ios && pod install && cd ..
npx react-native run-ios
```

Test the following paths on a real device when possible:

1. Send text, quick replies, buttons, lists, tables, and carousel messages.
2. Open voice input and verify microphone permission handling.
3. Play audio and video messages.
4. Select images and documents and verify upload behavior.
5. Open date, dropdown, radio, multi-select, OTP, and form templates.
6. Verify chart rendering, history loading, typing indicators, reconnects, close, minimize, and live-agent actions.

For a custom trimmed build, remove one optional native module at a time and confirm that the corresponding fallback renders instead of crashing the chat. Look for module-loaded, module-unavailable, and fallback messages in the development console.

## Error handling

Network, authentication, and socket failures are surfaced through socket events. Register `RTM_EVENT.ON_ERROR`, `RTM_EVENT.ERROR`, and `RTM_EVENT.ON_CLOSE` listeners in the host when it needs to display its own error state. Keep bot credentials and JWT handling on a secure server and never expose production secrets in source control.

## Permissions and feature troubleshooting

| Symptom | Check |
| --- | --- |
| Microphone permission denied | `Info.plist`, Android manifest, runtime permission request, and device settings |
| Voice button missing | `@react-native-voice/voice` installation, native linking, and a clean rebuild |
| Audio or video does not play | Corresponding native package, platform permissions, and device support |
| Attachments do not open | Document/file packages, storage permissions, and native rebuild |
| Header actions inactive | Remove `onHeaderActionsClick` temporarily; custom callbacks own all action behavior |

Use the development console to check for lazy-loading messages such as module unavailable, module loaded, or fallback selected.

## Run the sample application

The repository includes `SampleUI`, which is a local integration reference. From the repository root:

```bash
cd SampleUI
npm install
cd ios && pod install && cd ..
npx react-native start --reset-cache
```

In another terminal:

```bash
cd SampleUI
npx react-native run-ios
# or
npx react-native run-android
```

The sample uses a local file-linked SDK and therefore has a Metro configuration that resolves the app's React runtime first and SDK-only dependencies second. An external application installed from npm normally does not need this local-link configuration.

## Troubleshooting

- `ERESOLVE` or peer dependency errors: verify React 19, React Native 0.79.x, and matching v79 package versions.
- `useContext` is `null`: stop all Metro processes, reinstall dependencies if needed, and restart Metro with `--reset-cache`. Ensure the app and SDK resolve one React and one React Native runtime.
- `BotConfigModel` is not found: use `import type {BotConfigModel} from 'rn-kore-bot-sdk-v79'` and update the SDK to a current v79 release.
- Android “no matching variant”: clean the host Gradle/build directories, verify the RN 0.79 Android toolchain, reinstall the SDK, and rebuild.
- Metro cannot resolve an optional module: install that feature's native dependency, run native setup, and rebuild.
- iOS cannot launch: confirm a booted simulator or connected device, run `pod install`, and use the same Metro port configured by the app.

## Contributing

```bash
git clone https://github.com/Koredotcom/react-native-botsdk.git
cd react-native-botsdk/RNKoreBotSDK
npm install
npm test
npm run lint
npm run build
```

Use `SampleUI` as the local integration reference. Keep full SDK behavior and feature documentation in this root README; keep the `SampleUI/README.md` focused on running the sample and integrating the package in an external application.

## Development commands

```bash
npm install
npm test
npm run lint
npm run build
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Support

- Repository: <https://github.com/Koredotcom/react-native-botsdk>
- Kore.ai documentation: <https://docs.kore.ai>
- Report issues: <https://github.com/Koredotcom/react-native-botsdk/issues>
