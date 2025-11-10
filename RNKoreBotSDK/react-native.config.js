module.exports = {
  dependencies: {
    '@react-native-voice/voice': {
      platforms: {
        android: null, // Disable for Android - we use custom implementation
        ios: {}, // Enable for iOS - keep existing functionality
      },
    },
  },
};
