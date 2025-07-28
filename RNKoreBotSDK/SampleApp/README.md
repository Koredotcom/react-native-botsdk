This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Dependencies

This sample application demonstrates the Kore Bot SDK capabilities and includes various dependencies to support different features. Below is a detailed explanation of each dependency and its purpose:

## Core Bot SDK
- **`rn-kore-bot-sdk-v77-test`** `^0.0.8` - The main Kore Bot SDK library that provides all the bot functionality, chat interface, and bot interaction capabilities.

## Navigation & UI Structure
- **`@react-navigation/elements`** `^2.5.2` - Provides navigation elements like headers and tab bars for consistent navigation experience.
- **`@react-navigation/stack`** `^7.4.2` - Stack navigator for managing screen transitions and navigation flow in the bot application.
- **`react-native-safe-area-context`** `^5.5.2` - Ensures proper handling of safe areas on devices with notches, rounded corners, or home indicators.
- **`react-native-screens`** `^4.11.1` - Optimizes navigation performance by using native screen containers.

## Data Storage & Persistence
- **`@react-native-async-storage/async-storage`** `^2.2.0` - Local storage for persisting bot conversation history, user preferences, and session data.

## User Input & Interaction
- **`@react-native-community/datetimepicker`** `^8.4.2` - Date and time picker components for bot forms that require date/time input.
- **`@react-native-picker/picker`** `^2.11.1` - Dropdown picker component for bot templates that need selection inputs.
- **`@react-native-voice/voice`** `^3.2.4` - Voice recognition capabilities for voice-to-text input in bot conversations.
- **`react-native-gesture-handler`** `^2.26.0` - Enhanced gesture handling for smooth interactions like swipe gestures and touch responses.

## Media & File Handling
- **`react-native-document-picker`** `^9.3.1` - Allows users to pick and upload documents, PDFs, and other files to the bot.
- **`react-native-fast-image`** `^8.6.3` - Optimized image loading and caching for bot media content and avatars.
- **`react-native-fs`** `^2.20.0` - File system access for downloading, saving, and managing files shared through the bot.
- **`react-native-image-picker`** `^8.2.1` - Camera and photo library access for users to share images with the bot.
- **`react-native-video`** `^6.15.0` - Video playback component for bot responses that include video content.

## Audio & Speech
- **`react-native-tts`** `^4.1.1` - Text-to-speech functionality to read bot responses aloud.

## Data Visualization
- **`react-native-gifted-charts`** `^1.4.63` - Chart components (bar, line, pie charts) for bot responses that display data visualizations.
- **`react-native-svg`** `^15.12.0` - SVG rendering support for custom icons, charts, and graphics in bot templates.

## Enhanced UI Components
- **`react-native-reanimated`** `3.18.0` - Advanced animations for smooth transitions and interactive bot interface elements.
- **`react-native-reanimated-carousel`** `^4.0.2` - Carousel component for displaying multiple bot response cards or images.

## Device & System Integration
- **`@react-native-community/netinfo`** `^11.4.1` - Network connectivity detection to handle offline scenarios and connection status.
- **`react-native-orientation-locker`** `^1.7.0` - Controls screen orientation for optimal viewing of bot content.
- **`react-native-permissions`** `^5.4.1` - Manages device permissions for camera, microphone, storage, and other features.

## App Launch & Branding
- **`react-native-bootsplash`** `^6.3.9` - Custom splash screen for branded app launch experience.

## Development Dependencies
These dependencies are used during development and testing:

- **TypeScript Stack**: Provides type safety and better development experience
  - `typescript` `5.0.4` - TypeScript compiler
  - `@types/react` `^18.2.6` - React type definitions
  - `@types/jest` `^29.5.13` - Jest testing type definitions

- **Build & Bundling**: 
  - `@babel/core` `^7.25.2` - JavaScript compiler for modern syntax
  - `@react-native/metro-config` `0.77.0` - Metro bundler configuration for React Native

- **Code Quality**:
  - `eslint` `^8.19.0` - Code linting for consistent code style
  - `prettier` `2.8.8` - Code formatting
  - `@react-native/eslint-config` `0.77.0` - React Native specific ESLint rules

- **Testing**:
  - `jest` `^29.6.3` - Testing framework
  - `react-test-renderer` `18.3.1` - React component testing utilities

## Installation Notes

All dependencies are compatible with React Native 0.77.0. Some dependencies may require additional native configuration:

1. **iOS**: Run `bundle exec pod install` after installing dependencies
2. **Android**: Some dependencies may require additional permissions in `AndroidManifest.xml`
3. **Permissions**: Configure required permissions for camera, microphone, storage access

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
