#!/bin/bash

set -eux
cd "$(dirname "$0")/.."

npm run clean
BUILD_TYPE=dxt npm run build
npm run license:extract

mkdir -p build/tmp

cp package.json \
  package-lock.json \
  manifest.json \
  LICENSE \
  NOTICE \
  README.md \
  build/tmp/
cp -r dist build/tmp/

npm --prefix build/tmp install --only=production --frozen-lockfile

npx --prefix build/tmp dxt pack build/tmp build/garoon-mcp-server.dxt

# Revert build type to npm
BUILD_TYPE=npm npm run build

echo "DXT package created successfully at build/garoon-mcp-server.dxt"
