#!/bin/bash

set -eux
cd "$(dirname "$0")/.."

pnpm run clean
BUILD_TYPE=mcpb pnpm run build
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

pnpm exec mcpb pack build/tmp build/garoon-mcp-server.mcpb

echo "MCPB package created successfully at build/garoon-mcp-server.mcpb"
