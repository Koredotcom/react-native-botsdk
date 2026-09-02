package com.rnkorebotsdk;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.Locale;

public class VoiceRecognitionModule extends ReactContextBaseJavaModule implements RecognitionListener {
    private static final String TAG = "VoiceRecognitionModule";
    private SpeechRecognizer speechRecognizer;
    private Intent recognizerIntent;
    private boolean isListening = false;
    private ReactApplicationContext reactContext;
    private Handler mainHandler;

    public VoiceRecognitionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.mainHandler = new Handler(Looper.getMainLooper());
        
        // Initialize speech recognizer on main thread
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                initializeSpeechRecognizer();
            }
        });
    }

    // Utility method to ensure operations run on main UI thread
    private void runOnMainThread(Runnable runnable) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            // Already on main thread, run immediately
            runnable.run();
        } else {
            // Post to main thread
            mainHandler.post(runnable);
        }
    }

    @Override
    public String getName() {
        return "VoiceRecognitionModule";
    }

    private void initializeSpeechRecognizer() {
        try {
            // Check if speech recognition is available first
            if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                Log.e(TAG, "Speech recognition is not available on this device");
                Log.e(TAG, "Device: " + android.os.Build.MANUFACTURER + " " + android.os.Build.MODEL);
                return;
            }
            
            Log.d(TAG, "Creating SpeechRecognizer instance...");
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext);
            if (speechRecognizer == null) {
                Log.e(TAG, "Failed to create SpeechRecognizer - returned null");
                Log.e(TAG, "This usually indicates no speech recognition service is available");
                Log.e(TAG, "Check if Google app and Google Play Services are installed and updated");
                return;
            }
            
            Log.d(TAG, "Setting recognition listener...");
            speechRecognizer.setRecognitionListener(this);

            Log.d(TAG, "Creating recognizer intent...");
            recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, reactContext.getPackageName());

            Log.d(TAG, "Speech recognizer initialized successfully");
            Log.d(TAG, "Speech recognizer initialized successfully on main thread");
            Log.d(TAG, "Package name: " + reactContext.getPackageName());
            Log.d(TAG, "Language: " + Locale.getDefault());
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize speech recognizer on main thread: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void isAvailable(Promise promise) {
        try {
            boolean available = SpeechRecognizer.isRecognitionAvailable(reactContext);
            Log.d(TAG, "Speech recognition available: " + available);
            promise.resolve(available);
        } catch (Exception e) {
            Log.e(TAG, "Error checking availability: " + e.getMessage());
            promise.reject("AVAILABILITY_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void startListening(Promise promise) {
        Log.d(TAG, "startListening called");
        
        if (isListening) {
            promise.reject("ALREADY_LISTENING", "Speech recognition is already active");
            return;
        }

        // Check if speech recognition is available
        if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
            Log.e(TAG, "Speech recognition is not available on this device");
            promise.reject("NOT_AVAILABLE", "Speech recognition is not available on this device");
            return;
        }

        // Run on main UI thread - this is crucial for speech recognition
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                try {
                    // Initialize if needed
                    if (speechRecognizer == null) {
                        initializeSpeechRecognizer();
                    }

                    if (speechRecognizer == null) {
                        Log.e(TAG, "Failed to initialize speech recognizer");
                        promise.reject("INITIALIZATION_ERROR", "Failed to initialize speech recognizer");
                        return;
                    }

                    if (recognizerIntent == null) {
                        Log.e(TAG, "Recognizer intent is null");
                        promise.reject("INTENT_ERROR", "Recognizer intent is null");
                        return;
                    }

                    isListening = true;
                    speechRecognizer.startListening(recognizerIntent);
                    promise.resolve("Speech recognition started");

                } catch (SecurityException e) {
                    Log.e(TAG, "Security exception starting speech recognition: " + e.getMessage());
                    isListening = false;
                    promise.reject("PERMISSION_ERROR", "Microphone permission not granted: " + e.getMessage());
                } catch (Exception e) {
                    Log.e(TAG, "Error starting speech recognition: " + e.getMessage());
                    e.printStackTrace();
                    isListening = false;
                    promise.reject("START_ERROR", "Failed to start speech recognition: " + e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void stopListening(Promise promise) {
        if (!isListening) {
            promise.resolve("Not currently listening");
            return;
        }

        // Run on main UI thread
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (speechRecognizer != null) {
                        speechRecognizer.stopListening();
                    }
                    isListening = false;
                    promise.resolve("Speech recognition stopped");

                } catch (Exception e) {
                    Log.e(TAG, "Error stopping speech recognition: " + e.getMessage());
                    promise.reject("STOP_ERROR", e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void cancelListening(Promise promise) {
        // Run on main UI thread
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (speechRecognizer != null) {
                        speechRecognizer.cancel();
                    }
                    isListening = false;
                    promise.resolve("Speech recognition cancelled");

                } catch (Exception e) {
                    Log.e(TAG, "Error cancelling speech recognition: " + e.getMessage());
                    promise.reject("CANCEL_ERROR", e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void destroy(Promise promise) {
        // Run on main UI thread
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (speechRecognizer != null) {
                        speechRecognizer.destroy();
                        speechRecognizer = null;
                    }
                    isListening = false;
                    promise.resolve("Speech recognizer destroyed");

                } catch (Exception e) {
                    Log.e(TAG, "Error destroying speech recognizer: " + e.getMessage());
                    promise.reject("DESTROY_ERROR", e.getMessage());
                }
            }
        });
    }

    private void sendEvent(String eventName, WritableMap params) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        } catch (Exception e) {
            Log.e(TAG, "Error sending event " + eventName + ": " + e.getMessage());
        }
    }

    // RecognitionListener implementation
    @Override
    public void onReadyForSpeech(Bundle params) {
        WritableMap event = Arguments.createMap();
        sendEvent("onSpeechStart", event);
    }

    @Override
    public void onBeginningOfSpeech() {
        WritableMap event = Arguments.createMap();
        sendEvent("onSpeechRecognized", event);
    }

    @Override
    public void onRmsChanged(float rmsdB) {
        // Volume changed - can be used for voice level indicators
        WritableMap event = Arguments.createMap();
        event.putDouble("value", rmsdB);
        sendEvent("onSpeechVolumeChanged", event);
    }

    @Override
    public void onBufferReceived(byte[] buffer) {
        // Audio buffer received - not typically used
    }

    @Override
    public void onEndOfSpeech() {
        Log.d(TAG, "End of speech");
        isListening = false;
        WritableMap event = Arguments.createMap();
        sendEvent("onSpeechEnd", event);
    }

    @Override
    public void onError(int error) {
        Log.e(TAG, "Speech recognition error: " + error + " (" + getErrorMessage(error) + ")");
        isListening = false;
        
        WritableMap event = Arguments.createMap();
        String errorMessage = getErrorMessage(error);
        event.putString("error", errorMessage);
        event.putInt("code", error);
        
        // Log additional details for debugging
        Log.d(TAG, "Sending error event: " + errorMessage);
        
        sendEvent("onSpeechError", event);
        
        // If it's a critical error, reinitialize the speech recognizer on main thread
        if (error == SpeechRecognizer.ERROR_CLIENT || 
            error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY ||
            error == SpeechRecognizer.ERROR_SERVER) {
            runOnMainThread(new Runnable() {
                @Override
                public void run() {
                    if (speechRecognizer != null) {
                        try {
                            speechRecognizer.destroy();
                        } catch (Exception e) {
                            Log.w(TAG, "Error destroying speech recognizer: " + e.getMessage());
                        }
                        speechRecognizer = null;
                    }
                }
            });
        }
    }

    @Override
    public void onResults(Bundle results) {
        isListening = false;
        
        ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (matches != null && !matches.isEmpty()) {
            WritableArray resultArray = Arguments.createArray();
            for (String match : matches) {
                resultArray.pushString(match);
            }
            
            WritableMap event = Arguments.createMap();
            event.putArray("value", resultArray);
            sendEvent("onSpeechResults", event);
        }
    }

    @Override
    public void onPartialResults(Bundle partialResults) {
        Log.d(TAG, "Partial speech recognition results received");
        
        ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (matches != null && !matches.isEmpty()) {
            WritableArray resultArray = Arguments.createArray();
            for (String match : matches) {
                resultArray.pushString(match);
            }
            
            WritableMap event = Arguments.createMap();
            event.putArray("value", resultArray);
            sendEvent("onSpeechPartialResults", event);
        }
    }

    @Override
    public void onEvent(int eventType, Bundle params) {
        // Additional events - not typically used
    }

    private String getErrorMessage(int errorCode) {
        switch (errorCode) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "Audio recording error";
            case SpeechRecognizer.ERROR_CLIENT:
                return "Client side error";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "Insufficient permissions";
            case SpeechRecognizer.ERROR_NETWORK:
                return "Network error";
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "Network timeout";
            case SpeechRecognizer.ERROR_NO_MATCH:
                return "No recognition result matched";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "RecognitionService busy";
            case SpeechRecognizer.ERROR_SERVER:
                return "Server error";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "No speech input";
            default:
                return "Unknown error: " + errorCode;
        }
    }
}
