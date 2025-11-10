module.exports = {
  dependencies: {
    'rn-kore-bot-sdk-v79-test': {
      platforms: {
        android: null, // Disable Android autolinking - we'll integrate manually
        ios: {
          // iOS will use the podspec automatically
        },
      },
    },
  },
};
