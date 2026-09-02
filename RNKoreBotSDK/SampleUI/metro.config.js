const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const sdkRoot = path.resolve(__dirname, '..');

const config = {
  // The sample app uses the SDK from the sibling package during local
  // development. Metro must watch that package explicitly when it is linked.
  watchFolders: [sdkRoot],
  resolver: {
    // Resolve the SDK's imports from the sample app's installed dependency
    // tree, since the SDK source lives outside the app directory.
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    extraNodeModules: {
      'rn-kore-bot-sdk-v79': sdkRoot,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
