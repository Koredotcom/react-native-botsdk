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
  },
  // Don't bundle images and assets index - keep require() statements as-is
  // This allows Metro bundler to resolve them at runtime
  external: [
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.gif$/,
    /bot-sdk\/assets/, // Don't compile the assets folder
  ],
});
