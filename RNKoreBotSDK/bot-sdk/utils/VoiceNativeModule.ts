import { NativeModules, Platform } from "react-native";

/**
 * Returns the native voice module used by this SDK on the current platform.
 *
 * iOS uses @react-native-voice/voice's `Voice` module. Android uses the
 * SDK-owned VoiceRecognitionModule. Access is guarded because some host apps
 * intentionally omit speech recognition from their native build.
 */
export const getNativeVoiceModule = (): any | null => {
  const moduleName =
    Platform.OS === "ios"
      ? "Voice"
      : Platform.OS === "android"
      ? "VoiceRecognitionModule"
      : null;

  if (!moduleName) {
    return null;
  }

  try {
    return NativeModules?.[moduleName] || null;
  } catch (_error) {
    // NativeModules can be proxied by a host runtime. Treat an unavailable
    // module as an optional feature instead of allowing module lookup to fail.
    return null;
  }
};

export const isNativeVoiceModuleAvailable = (): boolean =>
  !!getNativeVoiceModule();
