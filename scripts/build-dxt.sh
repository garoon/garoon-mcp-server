#!/bin/bash

set -eux
cd "$(dirname "$0")/.."

pnpm run clean
BUILD_TYPE=dxt pnpm run build
pnpm run license:extract

mkdir -p build/tmp

cp package.json \
  pnpm-lock.yaml \
  manifest.json \
  icon.png \
  LICENSE \
  NOTICE \
  README.md \
  build/tmp/
cp -r dist build/tmp/

pnpm --prefix build/tmp install --prod --frozen-lockfile --config.shamefully-hoist=true

pnpm exec dxt pack build/tmp build/garoon-mcp-server.dxt

echo "DXT package created successfully at build/garoon-mcp-server.dxt"
