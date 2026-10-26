const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const sdkRoot = path.resolve(__dirname, '..');
const appNodeModules = path.resolve(__dirname, 'node_modules');
const sdkNodeModules = path.resolve(sdkRoot, 'node_modules');

const config = {
  // The sample app uses the SDK from the sibling package during local
  // development. The SDK root must be watched so Metro can read its
  // package.json and resolve the package entry point through the alias below.
  watchFolders: [sdkRoot],
  resolver: {
    // Resolve shared singletons from the app first, even for files under the
    // SDK folder. Loading a second React instance causes invalid hook calls.
    disableHierarchicalLookup: true,
    nodeModulesPaths: [appNodeModules, sdkNodeModules],
    extraNodeModules: {
      'rn-kore-bot-sdk-v79': sdkRoot,
      // The SDK is linked from a sibling directory during local development.
      // Force React and React Native to resolve from the app so the renderer
      // and the SDK never load separate physical copies.
      react: path.join(appNodeModules, 'react'),
      'react-native': path.join(appNodeModules, 'react-native'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
