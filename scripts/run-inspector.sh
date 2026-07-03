#!/bin/bash

cd "$(dirname "$0")/.."

if ! [ -x node_modules/.bin/mcp-inspector ]; then
  echo "Error: mcp-inspector is not installed. Run 'pnpm install --frozen-lockfile' first." >&2
  exit 1
fi

pnpm exec mcp-inspector tsx src/index.ts
