/**
 * Lazy Loading Components and Utilities
 * 
 * This module provides lazy loading functionality for heavy React Native dependencies
 * to reduce bundle size and improve app performance.
 */

// Core lazy loading utilities
export { LazyLoader, DefaultLoader, ErrorFallback } from '../../utils/LazyLoader';

// Lazy DateTimePicker components
export { 
  LazyDateTimePicker, 
  useLazyDateTimePicker, 
  FallbackDateTimePicker 
} from '../LazyDateTimePicker';

// Lazy Picker components
export { 
  LazyPicker,
  LazyPickerItem,
  useLazyPicker,
  FallbackPicker,
  FallbackPickerItem
} from '../LazyPicker';

// Lazy Voice components
export { 
  LazyVoice,
  useLazyVoice,
  FallbackVoice
} from '../LazyVoice';

// Lazy Video components
export { 
  LazyVideo,
  useLazyVideo,
  FallbackVideo
} from '../LazyVideo';

// LazyCarousel removed - use direct dynamic imports in components

// Lazy TTS components
export { 
  LazyTTS,
  useLazyTTS,
  FallbackTTS
} from '../LazyTTS';

// Lazy SVG components
export { 
  LazySvg,
  LazySvgPath,
  LazySvgRect,
  LazySvgCircle,
  LazySvgText,
  useLazySvg,
  FallbackSvg,
  FallbackSvgPath,
  FallbackSvgRect,
  FallbackSvgCircle,
  FallbackSvgText
} from '../LazySvg';

// Lazy Popover components
export { 
  LazyPopover,
  useLazyPopover,
  FallbackPopover
} from '../LazyPopover';

// Lazy Communications components
export { 
  LazyCommunications,
  useLazyCommunications,
  FallbackCommunications,
  FallbackCommunicationsAPI
} from '../LazyCommunications';

// Lazy Sound components
export { 
  LazySound,
  useLazySound,
  FallbackSound,
  FallbackSoundAPI
} from '../LazySound';

// Lazy Orientation components
export { 
  LazyOrientation,
  useLazyOrientation,
  FallbackOrientation
} from '../LazyOrientation';

// Lazy ParsedText components
export { 
  LazyParsedText,
  useLazyParsedText,
  FallbackParsedText
} from '../LazyParsedText';

// Enhanced modal with lazy loading
export { default as CustomDateTimePickerModal } from '../CustomDateTimePickerModal';

// Type definitions
export type {
  LazyDateTimePickerProps,
  DateTimePickerProps,
} from '../LazyDateTimePicker';

export type {
  LazyPickerProps,
  PickerProps,
  PickerItemProps,
} from '../LazyPicker';

export type {
  LazyVoiceProps,
  VoiceEvents,
  VoiceModule,
} from '../LazyVoice';

export type {
  LazyVideoProps,
  VideoProps,
} from '../LazyVideo';

// LazyImagePicker types removed

// LazyCarousel types removed

export type {
  LazyTTSProps,
  TTSModule,
  TTSOptions,
  Voice,
  Engine,
} from '../LazyTTS';

// LazyDocumentPicker types removed

export type {
  LazySvgProps,
  SvgProps,
  SvgPathProps,
  SvgRectProps,
  SvgCircleProps,
  SvgTextProps,
  SvgModule,
} from '../LazySvg';

export type {
  LazyFastImageProps,
  FastImageProps,
  FastImageModule,
} from '../LazyFastImage';

export type {
  LazyPopoverProps,
  PopoverProps,
} from '../LazyPopover';

export type {
  LazyCommunicationsProps,
  CommunicationsModule,
} from '../LazyCommunications';

export type {
  LazyOrientationProps,
  OrientationModule,
} from '../LazyOrientation';

export type {
  LazyParsedTextProps,
  ParsedTextProps,
  ParsedTextModule,
} from '../LazyParsedText';
