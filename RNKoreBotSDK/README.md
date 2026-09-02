# rn-kore-bot-sdk-v79-test

React Native chatbot UI SDK for React Native **0.79.x** and React **19.x**.

## Compatibility

| SDK package | React Native | React |
| --- | --- | --- |
| `rn-kore-bot-sdk-v79-test` | `>=0.79.0 <0.80.0` | `19.x` |

Do not install this package in an RN 0.77 application. Use the v77 SDK and its matching socket library instead. Do not mix the UI package, socket package, or native Android project from different SDK versions.

## Installation

```sh
npm install rn-kore-bot-sdk-v79-test
cd ios && pod install && cd ..
```

The SDK uses native dependencies for networking, media, documents, permissions, and voice features. Follow each dependency's native setup instructions, then rebuild the application. The host application must use a React Native 0.79-compatible Android Gradle Plugin, Gradle, Kotlin, Java, and compile SDK configuration.

The root application must be wrapped in `GestureHandlerRootView` when using gesture-handler-based features.

## Basic usage

```tsx
import React from 'react';
import {SafeAreaView} from 'react-native';
import KoreChat from 'rn-kore-bot-sdk-v79-test';
import type {BotConfigModel} from 'rn-kore-bot-sdk-v79-test';

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

export default function ChatScreen({navigation}: {navigation: any}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <KoreChat botConfig={botConfig} navigation={navigation} />
    </SafeAreaView>
  );
}
```

`BotConfigModel` is a TypeScript type. Use `import type` so it is not emitted as a runtime import.

## Header actions

The default header supports Back, Close, Help, Live Agent, and Reconnect actions. If `navigation` is provided, the default Close action sends the appropriate close event and navigates back. For an embedded chat view without navigation, provide `onClose`:

```tsx
<KoreChat botConfig={botConfig} onClose={() => setChatVisible(false)} />
```

`onHeaderActionsClick` is an override. When it is provided, the host application owns the action behavior and must handle every action it enables:

```tsx
import KoreChat, {HeaderIconsId} from 'rn-kore-bot-sdk-v79-test';

const onHeaderActionsClick = (action: string) => {
  switch (action) {
    case HeaderIconsId.CLOSE:
      setChatVisible(false);
      break;
    case HeaderIconsId.RECONNECT:
      // Call the socket client's reconnect method or omit the override
      // to use the SDK's default reconnect behavior.
      break;
  }
};
```

If `renderChatHeader` is supplied, the default header and its action handling are bypassed; the custom header must implement its own interactions.

## Socket events and connection state

The socket client and event names are available from the SDK package:

```tsx
import {KoreBotClient, RTM_EVENT} from 'rn-kore-bot-sdk-v79-test';

const client = KoreBotClient.getInstance();

client.on(RTM_EVENT.CONNECTING, () => console.log('connecting'));
client.on(RTM_EVENT.ON_OPEN, data => console.log('connected', data));
client.on(RTM_EVENT.ON_MESSAGE, message => console.log('message', message));
client.on(RTM_EVENT.ON_EVENTS, event => console.log('event', event));
client.on(RTM_EVENT.ERROR, error => console.warn('socket error', error));

// Use only when the host explicitly owns reconnect behavior.
client.reconnect(true, true);
```

The SDK itself registers listeners needed to render messages and typing state. Host listeners should be registered once and removed using the socket client's event-emitter API when the host screen unmounts. Do not call `removeAllListeners()` from the host application because that can remove SDK listeners.

## Troubleshooting

- `ERESOLVE` or peer dependency errors: verify that the host uses React 19 and RN 0.79.x, and that no v77 socket/UI package is installed.
- `BotConfigModel` is not found: update to test package `0.0.15` or later and import it as a type from `rn-kore-bot-sdk-v79-test`.
- Header actions appear inactive: remove `onHeaderActionsClick` temporarily to test the SDK defaults. If a custom callback or custom header is used, the host owns those actions.
- Android “no matching variant”: clean the host application's Gradle/build directories, verify the RN 0.79 Android toolchain, reinstall the SDK, and rebuild. Capture the complete Gradle dependency-selection error if the problem remains.
