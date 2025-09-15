#!/bin/bash

# Test script to verify DXT execution type
# Usage: ./scripts/test-dxt-execution-type.sh

set -e

echo "=== Testing DXT Execution Type ==="

# Run DXT build using the official build script
echo "🔨 Running DXT build..."
bin/dxt-build.sh

# Test execution type in DXT build output
echo "🧪 Testing execution type in DXT build..."
cd build/tmp

# Check build constants
echo "✅ Verifying DXT execution type..."
RESULT=$(node -e "
const { VERSION, EXECUTION_TYPE } = require('./dist/build-constants.js');
console.log('Version:', VERSION);
console.log('Execution Type:', EXECUTION_TYPE);

if (EXECUTION_TYPE === 'dxt') {
  console.log('PASS');
} else {
  console.log('FAIL: Expected dxt, got ' + EXECUTION_TYPE);
  process.exit(1);
}
")

cd ../..

if echo "$RESULT" | grep -q "PASS"; then
  echo "✅ DXT execution type test PASSED"
else
  echo "❌ DXT execution type test FAILED: $RESULT"
  exit 1
fi

echo "=== DXT test completed successfully ==="
