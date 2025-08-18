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

// Lazy ImagePicker components
export { 
  LazyImagePicker,
  useLazyImagePicker,
  FallbackImagePicker
} from '../LazyImagePicker';

// Lazy Carousel components
export { 
  LazyCarousel,
  useLazyCarousel,
  FallbackCarousel
} from '../LazyCarousel';

// Lazy TTS components
export { 
  LazyTTS,
  useLazyTTS,
  FallbackTTS
} from '../LazyTTS';

// Lazy DocumentPicker components
export { 
  LazyDocumentPicker,
  useLazyDocumentPicker,
  FallbackDocumentPicker
} from '../LazyDocumentPicker';

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

export type {
  LazyImagePickerProps,
  ImagePickerOptions,
  ImagePickerResponse,
  ImagePickerModule,
} from '../LazyImagePicker';

export type {
  LazyCarouselProps,
  CarouselProps,
} from '../LazyCarousel';

export type {
  LazyTTSProps,
  TTSModule,
  TTSOptions,
  Voice,
  Engine,
} from '../LazyTTS';

export type {
  LazyDocumentPickerProps,
  DocumentPickerOptions,
  DocumentPickerResponse,
  DocumentPickerModule,
} from '../LazyDocumentPicker';
