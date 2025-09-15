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

cd build/tmp && ../../node_modules/.bin/dxt pack . ../garoon-mcp-server.dxt

echo "DXT package created successfully at build/garoon-mcp-server.dxt"
