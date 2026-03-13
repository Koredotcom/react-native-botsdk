/**
 * Applies indexPageMiddleware fallback fix for @react-native/community-cli-plugin.
 * Fixes: Cannot read properties of undefined (reading 'handle') when starting Metro.
 */
const path = require('path');
const fs = require('fs');

const middlewarePath = path.join(
  process.cwd(),
  'node_modules',
  '@react-native',
  'community-cli-plugin',
  'dist',
  'commands',
  'start',
  'middleware.js'
);

const search = 'communityCliServerApi.indexPageMiddleware;';
const replacement = 'communityCliServerApi.indexPageMiddleware ?? noopNextHandle;';

try {
  if (!fs.existsSync(middlewarePath)) {
    process.exit(0); // package not installed, skip
  }
  let content = fs.readFileSync(middlewarePath, 'utf8');
  if (content.includes(replacement)) {
    process.exit(0); // already patched
  }
  if (!content.includes(search)) {
    process.exit(0); // different version, skip
  }
  content = content.replace(search, replacement);
  fs.writeFileSync(middlewarePath, content);
} catch (_) {
  process.exit(0); // ignore errors
}
