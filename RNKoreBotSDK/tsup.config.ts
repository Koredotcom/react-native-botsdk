import {defineConfig} from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./src/index.tsx'],
  dts: false,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  loader: {
    '.js': 'jsx',
    '.png': 'dataurl', // Convert PNG images to data URLs
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.gif': 'dataurl',
    '.svg': 'text', // Keep SVG as text for react-native-svg
  },
  // Remove inlineImage plugin as we're using built-in loaders
});
