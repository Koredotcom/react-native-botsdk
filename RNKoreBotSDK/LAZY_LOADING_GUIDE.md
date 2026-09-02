# Comprehensive Lazy/Dynamic Dependency Loading Guide

This guide describes how the SDK defers loading of heavy native/React Native modules. **`bot-sdk/components/lazy-loading`** exports wrapper components and hooks for a defined set of packages (see the table below). Other features—**image picker**, **document picker**, and **carousel**—use **dynamic `import()`** at the call site when needed.

Approximate impact depends on your bundler and tree-shaking; any size figures are **order-of-magnitude** guidance for the **initial JS bundle** when code is split correctly.

## Overview

Lazy loading loads modules on demand instead of always pulling them into the main bundle. Use the **`lazy-loading`** index for the supported wrappers, and use **dynamic `import()`** for image picker, document picker, and carousel (for example in `CarouselTemplate`, `MiniTableTemplate`, and `PermissionsUtils.js`).

## What is exported from `lazy-loading` (canonical list)

These are the symbols from `bot-sdk/components/lazy-loading/index.ts`:

| Area | Package | Wrapper / API |
|------|---------|----------------|
| Core | — | `LazyLoader`, `DefaultLoader`, `ErrorFallback` |
| Date/time | `@react-native-community/datetimepicker` | `LazyDateTimePicker`, `useLazyDateTimePicker`, `FallbackDateTimePicker`, `CustomDateTimePickerModal` |
| Picker | `@react-native-picker/picker` | `LazyPicker`, `LazyPickerItem`, `useLazyPicker`, `FallbackPicker`, `FallbackPickerItem` |
| Voice | `@react-native-voice/voice` | `LazyVoice`, `useLazyVoice`, `FallbackVoice` |
| Video | `react-native-video` | `LazyVideo`, `useLazyVideo`, `FallbackVideo` |
| TTS | `react-native-tts` | `LazyTTS`, `useLazyTTS`, `FallbackTTS` |
| Popover | `react-native-popover-view` | `LazyPopover`, `useLazyPopover`, `FallbackPopover` |
| Communications | `react-native-communications` | `LazyCommunications`, `useLazyCommunications`, `FallbackCommunications`, `FallbackCommunicationsAPI` |
| Sound | `react-native-sound` | `LazySound`, `useLazySound`, `FallbackSound`, `FallbackSoundAPI` |
| Parsed text | `react-native-parsed-text` | `LazyParsedText`, `useLazyParsedText`, `FallbackParsedText` |
| Slider | `@react-native-community/slider` | `LazySlider`, `useLazySlider`, `FallbackSlider` |

## Image picker, document picker, and carousel (dynamic `import()`)

These are loaded with **`import()`** when the feature runs. They are normal **`package.json`** dependencies.

| Package | Typical use in this repo |
|---------|---------------------------|
| **react-native-image-picker** | `import('react-native-image-picker')` in permission fallbacks (`PermissionsUtils.js`) and wherever you launch camera/library |
| **react-native-document-picker** | `import('react-native-document-picker')` at the call site when picking files |
| **react-native-reanimated-carousel** | `import('react-native-reanimated-carousel')` in `CarouselTemplate` and `MiniTableTemplate` (state-held dynamic component) |

## Other dependencies (static imports)

- **`react-native-fast-image`** — imported directly in templates and chat components.
- **`react-native-svg`** — imported where SVG rendering is needed.

Those use ordinary static imports, so they follow Metro’s dependency graph like any other direct import.

## Benefits

- **Smaller initial JS graph**: Heavy modules wrapped behind `LazyLoader.importModule` or dynamic `import()` load when first needed
- **Improved startup**: Less work before first paint when those features are unused
- **Progressive UX**: Loading and fallback UI while native modules resolve
- **Error resilience**: Failed loads can show fallbacks instead of crashing the tree
- **Caching**: `LazyLoader` caches successful imports by key for reuse

## Implementation

### 1. LazyLoader Utility

The `LazyLoader` class provides utilities for dynamic imports with caching:

```typescript
import { LazyLoader } from '../utils/LazyLoader'; // under bot-sdk

// Dynamic import with caching for any dependency
const Component = await LazyLoader.importModule(
  () => import('any-react-native-dependency'),
  'unique-cache-key'
);
```

### 2. Available Lazy Components

Import from **`bot-sdk/components/lazy-loading`** (or your app’s re-export). Example:

```typescript
import {
  LazyLoader,
  LazyVideo, useLazyVideo, FallbackVideo,
  LazyTTS, useLazyTTS, FallbackTTS,
  LazySound, useLazySound, FallbackSound,
  LazyParsedText, useLazyParsedText, FallbackParsedText,
  LazyDateTimePicker, useLazyDateTimePicker, FallbackDateTimePicker,
  LazyPicker, LazyPickerItem, useLazyPicker, FallbackPicker, FallbackPickerItem,
  LazyVoice, useLazyVoice, FallbackVoice,
  LazyPopover, useLazyPopover, FallbackPopover,
  LazyCommunications, useLazyCommunications, FallbackCommunications, FallbackCommunicationsAPI,
  LazySlider, useLazySlider, FallbackSlider,
  CustomDateTimePickerModal,
} from './lazy-loading';

// Example: image picker / document picker / carousel via dynamic import()
// const { launchCamera } = await import('react-native-image-picker');
// const DocumentPicker = await import('react-native-document-picker');
// const CarouselMod = await import('react-native-reanimated-carousel');
```

### 3. Component Usage Examples

#### **Video Player**
```typescript
<LazyVideo
  source={{ uri: videoUrl }}
  style={{ width: 300, height: 200 }}
  fallbackComponent={FallbackVideo}
  onLoad={handleVideoLoad}
/>
```

#### **Image Picker (dynamic import)**
```typescript
const handleImagePicker = async () => {
  try {
    const { launchCamera } = await import('react-native-image-picker');
    const result = await launchCamera({ mediaType: 'photo' });
    if (result.assets) {
      // Handle selected images
    }
  } catch (error) {
    console.warn('Image picker not available:', error);
  }
};
```

#### **Carousel (dynamic import)**
```typescript
const CarouselComponent = await import('react-native-reanimated-carousel');
<CarouselComponent
  data={carouselData}
  renderItem={({ item }) => <YourItemComponent item={item} />}
  width={screenWidth}
  height={200}
/>
```

#### **Text-to-Speech (Hook)**
```typescript
const { speak, stop, isAvailable, isLoading } = useLazyTTS();

const handleSpeak = async () => {
  if (isAvailable) {
    await speak("Hello world!", { rate: 0.5 });
  }
};
```

#### **Sound Player (Hook)**
```typescript
const { createSound, setCategory, isLoading, loadError } = useLazySound();

const handlePlaySound = async () => {
  try {
    // Create a sound instance
    const sound = await createSound('audio.mp3', '', (error) => {
      if (error) {
        console.log('Failed to load sound', error);
      }
    });

    if (sound) {
      // Play the sound
      sound.play((success) => {
        if (success) {
          console.log('Successfully played sound');
        }
      });
    }
  } catch (error) {
    console.error('Sound not available:', error);
  }
};

// Set audio category for iOS
React.useEffect(() => {
  setCategory('Playback', true);
}, []);
```

#### **Sound Player (Component)**
```typescript
<LazySound
  autoLoad={true}
  onModuleLoaded={(soundModule) => {
    if (soundModule) {
      console.log('Sound module loaded successfully');
      // Set up audio session
      soundModule.setCategory('Playback', true);
    }
  }}
  fallbackComponent={() => (
    <Text>Audio playback not available</Text>
  )}
/>
```

#### **ParsedText (Lazy Loading)**
```typescript
import { LazyParsedText, useLazyParsedText } from './lazy-loading';

// Direct usage - seamlessly replaces ParsedText
<LazyParsedText
  style={styles.text}
  parse={[
    { type: 'url', style: styles.url },
    { type: 'phone', style: styles.phone },
    { type: 'email', style: styles.email }
  ]}
  onPress={(url, matchIndex) => Linking.openURL(url)}
>
  Visit https://example.com or call 555-123-4567
</LazyParsedText>

// Hook usage
const { ParsedTextComponent, loadParsedText, loadError } = useLazyParsedText();
```

#### **Document Picker (dynamic import)**
```typescript
const handleDocumentPicker = async () => {
  try {
    const DocumentPicker = await import('react-native-document-picker');
    const docs = await DocumentPicker.pick({ 
      allowMultiSelection: true,
      type: ['pdf', 'doc', 'docx'] 
    });
    // Handle selected documents
  } catch (error) {
    console.log('Document picker error:', error);
  }
};
```

#### **Date Picker**
```typescript
<LazyDateTimePicker
  value={selectedDate}
  mode="date"
  onChange={handleDateChange}
  fallbackComponent={FallbackDateTimePicker}
/>
```

#### **Native Picker**
```typescript
<LazyPicker
  selectedValue={selectedValue}
  onValueChange={handlePickerChange}
  fallbackComponent={FallbackPicker}
>
  <LazyPicker.Item label="Option 1" value="1" />
  <LazyPicker.Item label="Option 2" value="2" />
</LazyPicker>
```

#### **Voice Recognition (Hook)**
```typescript
const { startRecognizing, stopRecognizing, isAvailable } = useLazyVoice({
  onSpeechResults: (results) => {
    console.log('Speech results:', results.value);
  },
  onSpeechError: (error) => {
    console.error('Speech error:', error);
  },
});
```

### 4. Hook-based Usage Pattern

All lazy components provide hooks for functional components:

```typescript
const MyComponent = () => {
  const { Component, isLoading, loadError, isAvailable } = useLazyComponent();
  
  if (isLoading) return <LoadingSpinner />;
  if (loadError) return <ErrorMessage error={loadError} />;
  if (!isAvailable) return <FeatureUnavailable />;
  if (Component) {
    return <Component {...props} />;
  }
  return null;
};
```

## Advanced Usage Examples

### Custom Loading States

You can customize loading and error states for any lazy component:

```typescript
const CustomLoader = () => (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#4ECDC4" />
    <Text>Loading component...</Text>
  </View>
);

const CustomError = ({ error }: { error: string }) => (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Text style={{ color: 'red' }}>Failed to load: {error}</Text>
    <TouchableOpacity onPress={() => reloadApp()}>
      <Text>Retry</Text>
    </TouchableOpacity>
  </View>
);

// Use with any lazy component
<LazyVideo
  source={{ uri: videoUrl }}
  loadingComponent={CustomLoader}
  errorComponent={CustomError}
  fallbackComponent={FallbackVideo}
/>
```

### Modal Usage (DateTimePicker)

```typescript
import { CustomDateTimePickerModal } from './lazy-loading';
// or: import CustomDateTimePickerModal from '../CustomDateTimePickerModal';

const [showModal, setShowModal] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());

<CustomDateTimePickerModal
  isVisible={showModal}
  mode="date"
  date={selectedDate}
  onConfirm={(date) => {
    setSelectedDate(date);
    setShowModal(false);
  }}
  onCancel={() => setShowModal(false)}
/>
```

### Preloading Strategy

You can preload components to improve user experience:

```typescript
// Preload frequently used components on app initialization
useEffect(() => {
  setTimeout(() => {
    LazyLoader.importModule(() => import('react-native-video'), 'video');
    import('react-native-image-picker'); // optional preload
  }, 2000);
}, []);
```

## Configuration

### Package.json Dependencies

All lazy-loaded dependencies should be listed as dependencies (not devDependencies) for proper module resolution:

```json
{
  "dependencies": {
    "react-native-video": "^6.15.0",
    "react-native-image-picker": "^8.2.1",
    "react-native-reanimated-carousel": "^4.0.2",
    "react-native-tts": "^4.1.1",
    "react-native-document-picker": "^9.3.1",
    "@react-native-community/datetimepicker": "^8.4.2",
    "@react-native-picker/picker": "^2.11.0",
    "@react-native-voice/voice": "^3.2.4"
  }
}
```

**Note**: With lazy loading, users can selectively install only the dependencies they need.

### Metro Configuration

For React Native, ensure your `metro.config.js` supports dynamic imports:

```javascript
module.exports = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'svg'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

### TypeScript Configuration

Ensure your `tsconfig.json` supports dynamic imports:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## Error Handling

The lazy loading implementation includes comprehensive error handling:

1. **Network Errors**: When the module fails to download
2. **Module Errors**: When the imported module is invalid
3. **Component Errors**: When the component fails to render
4. **Fallback Components**: Alternative UI when the main component is unavailable

## Performance Considerations

### Bundle Analysis

To see the impact of lazy loading, analyze your bundle:

```bash
# For React Native
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js --verbose

# Analyze the bundle size before and after implementing lazy loading
```

### Bundle Size Impact (illustrative)

| Module | How it is loaded | Notes |
|--------|------------------|--------|
| Video, TTS, Sound, ParsedText, DateTimePicker, Picker, Voice, Popover, Communications, Slider | `lazy-loading` wrappers | First use via `LazyLoader` |
| Image picker, document picker, carousel | Dynamic `import()` at call site | See templates / `PermissionsUtils.js` |
| Fast Image, SVG | Static `import` | Standard Metro graph |

Treat totals as **guidance**, not guarantees—measure with your Metro setup.

### Communications (Phone, SMS, Email)

The `react-native-communications` package is lazy-loaded to prevent crashes when not installed:

```typescript
import { useLazyCommunications, FallbackCommunicationsAPI } from './lazy-loading';

const ContactComponent = () => {
  const { phonecall, email, text, isLoading, loadError } = useLazyCommunications();
  
  const handleCall = async () => {
    try {
      await phonecall('+1234567890', true); // true shows confirmation prompt
    } catch (error) {
      // Automatically falls back to Linking API
      console.log('Using fallback phone functionality');
    }
  };
  
  const handleEmail = async () => {
    try {
      await email(['test@example.com'], null, null, 'Subject', 'Message body');
    } catch (error) {
      // Automatically falls back to Linking API
      console.log('Using fallback email functionality');
    }
  };
  
  const handleText = async () => {
    try {
      await text('+1234567890', 'Hello from app!');
    } catch (error) {
      // Automatically falls back to Linking API
      console.log('Using fallback SMS functionality');
    }
  };
  
  return (
    <View>
      <Button title="Call" onPress={handleCall} />
      <Button title="Email" onPress={handleEmail} />
      <Button title="Text" onPress={handleText} />
    </View>
  );
};

// Or use the fallback API directly (always available)
FallbackCommunicationsAPI.phonecall('+1234567890', true);
FallbackCommunicationsAPI.email(['test@example.com'], null, null, 'Subject', 'Body');
FallbackCommunicationsAPI.text('+1234567890', 'Hello');
FallbackCommunicationsAPI.web('https://example.com');
```

**Benefits:**
- No crashes when `react-native-communications` is not installed
- Automatic fallback to React Native's Linking API
- Graceful degradation for apps that don't need all communication features
- Smaller bundle size when communications features aren't used

### Preloading Strategy

You can strategically preload components to improve user experience:

```typescript
// Preload critical components after app initialization
useEffect(() => {
  // Wait 2 seconds to not impact initial load
  setTimeout(() => {
    // Preload most commonly used components
    import('react-native-image-picker'); // optional preload
    LazyLoader.importModule(() => import('@react-native-community/datetimepicker'), 'datetimepicker');
    LazyLoader.importModule(() => import('react-native-communications'), 'communications');
    
    // Preload others based on user behavior
    if (userLikesVideos) {
      LazyLoader.importModule(() => import('react-native-video'), 'video');
    }
  }, 2000);
}, []);
```

## Platform-Specific Considerations

### iOS
- Modal presentation works best
- Supports all display modes (default, spinner, compact, inline)
- Requires user interaction to confirm selection

### Android
- Native picker shows directly
- Automatically closes after selection
- Limited display mode support

### Web
- Falls back to HTML5 date/time inputs
- Consider using a web-specific date picker library

## Migration Guide

### From Direct Imports to Lazy Loading

**Before (Traditional Imports):**
```typescript
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Voice from '@react-native-voice/voice';
import DocumentPicker from 'react-native-document-picker';
import Carousel from 'react-native-reanimated-carousel';
import Tts from 'react-native-tts';

// All components loaded immediately, increasing bundle size
```

**After (lazy-loading wrappers + dynamic imports where appropriate):**
```typescript
import {
  LazyVideo,
  LazyDateTimePicker,
  LazyPicker,
  useLazyVoice,
  useLazyTTS,
  useLazySound,
  FallbackVideo,
  FallbackDateTimePicker,
  FallbackSound,
} from './lazy-loading';

// const { launchImageLibrary } = await import('react-native-image-picker');
```

### Migration Examples

#### **Video Player Migration**
```typescript
// Before
import Video from 'react-native-video';
<Video source={{ uri: videoUrl }} style={styles.video} />

// After  
import { LazyVideo, FallbackVideo } from './lazy-loading';
<LazyVideo 
  source={{ uri: videoUrl }} 
  style={styles.video}
  fallbackComponent={FallbackVideo}
/>
```

#### **Image Picker Migration**
```typescript
// Before
import { launchImageLibrary } from 'react-native-image-picker';
const result = await launchImageLibrary({ mediaType: 'photo' });

// After: dynamic import
const { launchImageLibrary } = await import('react-native-image-picker');
const result = await launchImageLibrary({ mediaType: 'photo' });
```

#### **Picker Migration**
```typescript
// Before
import { Picker } from '@react-native-picker/picker';
<Picker selectedValue={value} onValueChange={onChange}>
  <Picker.Item label="Option 1" value="1" />
</Picker>

// After
import { LazyPicker, FallbackPicker } from './lazy-loading';
<LazyPicker 
  selectedValue={value} 
  onValueChange={onChange}
  fallbackComponent={FallbackPicker}
>
  <LazyPicker.Item label="Option 1" value="1" />
</LazyPicker>
```

#### **Sound Migration**
```typescript
// Before
import Sound from 'react-native-sound';
const sound = new Sound('audio.mp3', '', (error) => {
  if (error) return;
  sound.play();
});

// After
import { useLazySound, FallbackSoundAPI } from './lazy-loading';
const { createSound, isLoading, loadError } = useLazySound();

const playAudio = async () => {
  try {
    const sound = await createSound('audio.mp3', '', (error) => {
      if (error) return;
      sound.play();
    });
  } catch (error) {
    // Fallback handled automatically
    console.warn('Audio playback not available');
  }
};
```

### Testing

When testing components that use lazy loading:

```typescript
// Mock lazy-loading exports used by your tests
jest.mock('./lazy-loading', () => ({
  LazyVideo: ({ children, ...props }) =>
    <div data-testid="video-player" {...props}>{children}</div>,
  LazyDateTimePicker: ({ children, ...props }) =>
    <div data-testid="date-picker" {...props}>{children}</div>,
  LazyPicker: ({ children, ...props }) =>
    <div data-testid="picker" {...props}>{children}</div>,
  LazyVoice: ({ children, ...props }) =>
    <div data-testid="voice" {...props}>{children}</div>,
  LazyTTS: ({ children, ...props }) =>
    <div data-testid="tts" {...props}>{children}</div>,
  LazySound: ({ children, ...props }) =>
    <div data-testid="sound-player" {...props}>{children}</div>,
  LazyParsedText: ({ children, ...props }) =>
    <div data-testid="parsed-text" {...props}>{children}</div>,
  LazySlider: ({ children, ...props }) =>
    <div data-testid="slider" {...props}>{children}</div>,
  LazyPopover: ({ children, ...props }) =>
    <div data-testid="popover" {...props}>{children}</div>,
  LazyCommunications: ({ children, ...props }) =>
    <div data-testid="communications" {...props}>{children}</div>,

  useLazyVideo: () => ({ VideoComponent: MockVideo, isLoading: false, loadError: null }),
  useLazyVoice: () => ({ startRecognizing: jest.fn(), stopRecognizing: jest.fn(), isAvailable: true }),
  useLazyTTS: () => ({ speak: jest.fn(), stop: jest.fn(), isAvailable: true }),
  useLazySound: () => ({ createSound: jest.fn(), setCategory: jest.fn(), isLoading: false, loadError: null }),
  useLazyDateTimePicker: () => ({ DateTimePickerComponent: MockDateTimePicker, isLoading: false }),
  useLazyPicker: () => ({ PickerComponent: MockPicker, PickerItem: MockPickerItem, isLoading: false }),
}));

// Mock dynamic imports for image picker / document picker / carousel in tests:
jest.mock('react-native-image-picker', () => ({ launchCamera: jest.fn(), launchImageLibrary: jest.fn() }));
jest.mock('react-native-document-picker', () => ({ pick: jest.fn(), types: {} }));
jest.mock('react-native-reanimated-carousel', () => 'Carousel');
```

## Best Practices

1. **Always provide fallbacks** for when components fail to load
2. **Use meaningful loading states** to improve user experience  
3. **Cache loaded components** to avoid repeated network requests
4. **Handle errors gracefully** with user-friendly messages
5. **Consider preloading** for frequently used components
6. **Test on slow networks** to ensure good UX during loading
7. **Monitor bundle sizes** to verify lazy loading effectiveness
8. **Selective dependencies** - Users can install only what they need
9. **Progressive enhancement** - Apps work without optional dependencies
10. **Platform testing** - Test fallbacks on all target platforms

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure the package is installed and listed in dependencies
2. **Import errors**: Check that your bundler supports dynamic imports  
3. **TypeScript errors**: Verify your tsconfig.json configuration
4. **Network timeouts**: Implement retry logic for failed loads
5. **Platform compatibility**: Some components may not work on all platforms
6. **Native linking**: Ensure proper native module linking for each dependency
7. **Permission issues**: Handle platform-specific permissions (camera, microphone, etc.)
8. **Version conflicts**: Ensure compatible versions of all dependencies

### Debug Mode

Enable debug logging to troubleshoot loading issues:

```typescript
// Add this to your LazyLoader implementation
const DEBUG = __DEV__;

if (DEBUG) {
  console.log('Loading module:', moduleKey);
  console.log('Import function:', importFn.toString());
}
```

### Component-Specific Troubleshooting

#### **Video Player Issues**
- Check video format compatibility
- Verify network permissions for remote videos
- Test fallback for unsupported formats

#### **Image Picker Issues**  
- Verify camera and photo library permissions
- Test on both iOS and Android
- Handle permission denied scenarios

#### **Voice Recognition Issues**
- Check microphone permissions
- Test on physical devices (not simulators)
- Handle network connectivity for cloud-based recognition

#### **TTS Issues**
- Verify system TTS availability
- Test with different languages/voices
- Handle device-specific TTS limitations

## Architecture Benefits

This comprehensive lazy loading implementation provides:

- **Modular Architecture**: Each component is independently loadable
- **Graceful Degradation**: Apps work even when components fail to load
- **Performance optimization**: Deferring heavy modules until needed can shrink work on first load (measure in your app)
- **Developer Experience**: Easy to implement and maintain
- **User Experience**: Faster app startup with progressive feature loading
- **Production Ready**: Comprehensive error handling and fallbacks

The lazy loading system is designed to be robust, scalable, and easy to extend to additional dependencies as needed.
