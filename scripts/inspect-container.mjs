import { readFileSync, readdirSync } from 'fs';

console.log('=== Container Inspection ===');

console.log('\n📁 Root directory contents:');
console.log(readdirSync('/app'));

console.log('\n📁 dist/ directory contents:');
console.log(readdirSync('/app/dist'));

console.log('\n📄 build-constants.js content:');
try {
  const buildConstants = readFileSync('/app/dist/build-constants.js', 'utf8');
  console.log(buildConstants);
} catch (error) {
  console.log('Error reading build-constants.js:', error.message);
}

console.log('\n📄 package.json version:');
try {
  const packageJson = JSON.parse(readFileSync('/app/package.json', 'utf8'));
  console.log('Version:', packageJson.version);
  console.log('Name:', packageJson.name);
} catch (error) {
  console.log('Error reading package.json:', error.message);
}

console.log('\n🔍 Import and test build constants:');
try {
  const { VERSION, EXECUTION_TYPE } = await import('../dist/build-constants.js');
  console.log('VERSION:', VERSION);
  console.log('EXECUTION_TYPE:', EXECUTION_TYPE);
  console.log('User-Agent:', `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`);
} catch (error) {
  console.log('Error importing build constants:', error.message);
}
