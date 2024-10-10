const esbuild = require('esbuild');
const {transformFileSync} = require('@babel/core');
const fs = require('fs');
const path = require('path');
const inlineImage = require('esbuild-plugin-inline-image');

// Helper function to process files with Babel
const processFilesInDirectory = dir => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively process subdirectories
      processFilesInDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.tsx')) {
      const {code} = transformFileSync(filePath, {
        presets: ['module:metro-react-native-babel-preset'],
        plugins: ['react-native-reanimated/plugin'],
        sourceMaps: true,
      });
      fs.writeFileSync(filePath, code);
    }
  });
};

// Build ES module for the main entry point
esbuild
  .build({
    entryPoints: ['./src/index.tsx'],
    bundle: true,
    format: 'esm',
    outdir: 'dist',
    sourcemap: true,
    target: 'es2022',
    external: [
      'react',
      'react-native',
      'fs',
      'react-native-fast-image', // Mark fast-image as external
    ],
    plugins: [inlineImage()],
    loader: {
      '.js': 'jsx',
      '.ts': 'tsx',
      '.tsx': 'tsx',
      '.json': 'json',
      '.png': 'file',
      '.jpg': 'file',
    },
  })
  .then(() => {
    // Post-process files with Babel
    processFilesInDirectory('dist');
    console.log('Build succeeded');
  })
  .catch(error => {
    console.error('Build failed:', error);
  });
