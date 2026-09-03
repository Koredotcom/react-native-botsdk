const path = require('path');
const fs = require('fs');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const sdkRoot = path.resolve(__dirname, '..');
const appNodeModules = path.resolve(__dirname, 'node_modules');
const sdkNodeModules = path.join(sdkRoot, 'node_modules');
const sdkPackage = require(path.join(sdkRoot, 'package.json'));

// The local file-linked SDK has dependencies that are not direct SampleUI
// dependencies. Alias only those missing packages to the SDK install. React
// and React Native are deliberately excluded and remain pinned to the app.
const sdkDependencyAliases = Object.keys(sdkPackage.dependencies || {})
  .filter(
    dependency =>
      dependency !== 'react' &&
      dependency !== 'react-native' &&
      !fs.existsSync(path.join(appNodeModules, dependency)) &&
      fs.existsSync(path.join(sdkNodeModules, dependency)),
  )
  .reduce((aliases, dependency) => {
    aliases[dependency] = path.join(sdkNodeModules, dependency);
    return aliases;
  }, {});

const config = {
  // The sample app uses the SDK from the sibling package during local
  // development. Metro must watch that package explicitly when it is linked.
  watchFolders: [sdkRoot],
  resolver: {
    // Resolve the SDK's imports from the sample app's installed dependency
    // tree, since the SDK source lives outside the app directory.
    // Without this, Metro can walk up into the SDK repository's node_modules
    // and load a second React instance for watched SDK files.
    disableHierarchicalLookup: true,
    // Prefer the app's modules (especially React/React Native), then fall
    // back to SDK-only dependencies installed in the linked package root.
    nodeModulesPaths: [appNodeModules, sdkNodeModules],
    extraNodeModules: {
      'rn-kore-bot-sdk-v79': sdkRoot,
      // The SDK is watched from outside the app directory. Pin these shared
      // runtimes to the app copies so SDK and app components use the same
      // React dispatcher and native module registry.
      react: path.join(appNodeModules, 'react'),
      'react-native': path.join(appNodeModules, 'react-native'),
      ...sdkDependencyAliases,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
