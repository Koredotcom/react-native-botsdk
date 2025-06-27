import {defineConfig} from 'tsup';
import inlineImage from 'esbuild-plugin-inline-image';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./src/index.tsx'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  loader: {'.js': 'jsx'},
  plugins: [inlineImage()],
});
