#!/bin/bash

cd "$(dirname $0)/.."

if [ -f .env.local ]; then
  source .env.local
  npx @modelcontextprotocol/inspector -e GAROON_BASE_URL=${GAROON_BASE_URL} -e GAROON_USERNAME=${GAROON_USERNAME} -e GAROON_PASSWORD=${GAROON_PASSWORD} tsx src/index.ts
else
  npx @modelcontextprotocol/inspector tsx src/index.ts
fi
