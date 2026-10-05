#!/bin/bash

cd "$(dirname "$0")/.."

if ! [ -x node_modules/.bin/mcp-inspector ]; then
  echo "Error: mcp-inspector is not installed. Run 'pnpm install --frozen-lockfile' first." >&2
  exit 1
fi

# MCP Inspector v2 does not pass the parent environment to the server process, so each variable is forwarded explicitly.
# Keep this list in sync with the variables read in src/config.ts.
# NODE_OPTIONS resolves `#` subpath imports to src (not dist) so the inspector runs against the current sources.
env_args=(-e NODE_OPTIONS=--conditions=development)
for name in GAROON_BASE_URL GAROON_USERNAME GAROON_PASSWORD \
  GAROON_BASIC_AUTH_USERNAME GAROON_BASIC_AUTH_PASSWORD \
  GAROON_PFX_FILE_PATH GAROON_PFX_FILE_PASSWORD GAROON_PUBLIC_ONLY \
  https_proxy http_proxy; do
  # The inspector rejects `-e KEY=` with an empty value.
  if [ -n "${!name:-}" ]; then
    env_args+=(-e "$name=${!name}")
  fi
done

pnpm exec mcp-inspector "${env_args[@]}" tsx src/index.ts
