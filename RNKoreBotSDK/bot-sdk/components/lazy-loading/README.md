# Lazy Loading Implementation

This directory exposes **`index.ts`**, the public entry for lazy/dynamic loading of several heavy dependencies. See **`LAZY_LOADING_GUIDE.md`** at the SDK root for full documentation.

## What `index.ts` exports

`index.ts` re-exports wrappers and hooks for:

- **Video** (`react-native-video`)
- **TTS** (`react-native-tts`)
- **Sound** (`react-native-sound`)
- **Parsed text** (`react-native-parsed-text`)
- **Date/time picker** (`@react-native-community/datetimepicker`) + `CustomDateTimePickerModal`
- **Picker** (`@react-native-picker/picker`)
- **Voice** (`@react-native-voice/voice`)
- **Popover** (`react-native-popover-view`)
- **Communications** (`react-native-communications`)
- **Slider** (`@react-native-community/slider`)
- **Core** — `LazyLoader`, `DefaultLoader`, `ErrorFallback` from `bot-sdk/utils/LazyLoader.tsx`

## Image picker, document picker, and carousel

These are loaded with **dynamic `import()`** at the call site (see `PermissionsUtils.js`, `CarouselTemplate`, `MiniTableTemplate`). They are normal **`package.json`** dependencies and are not listed in `index.ts`.

## Other dependencies (static imports)

- **`react-native-fast-image`** — imported statically across templates and chat UI.
- **`react-native-svg`** — imported where SVG rendering is required.

## Quick start

```typescript
import {
  LazyVideo,
  useLazyVideo,
  FallbackVideo,
  LazyParsedText,
  LazySlider,
  LazyPopover,
  LazyCommunications,
} from './lazy-loading';

const { launchCamera } = await import('react-native-image-picker');
```

## Files

- **`index.ts`** — Public exports (source of truth for the API surface)
- **`LAZY_LOADING_GUIDE.md`** — SDK root guide (architecture, migration, troubleshooting)
