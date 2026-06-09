#!/bin/bash

cd "$(dirname "$0")/.."

if ! [ -x node_modules/.bin/mcp-inspector ]; then
  echo "Error: mcp-inspector is not installed. Run 'pnpm install --frozen-lockfile' first." >&2
  exit 1
fi

ARGS=()
if [ -f .env.local ]; then
  source .env.local
  ARGS+=( -e "GAROON_BASE_URL=${GAROON_BASE_URL}" )
  ARGS+=( -e "GAROON_USERNAME=${GAROON_USERNAME}" )
  ARGS+=( -e "GAROON_PASSWORD=${GAROON_PASSWORD}" )

  if [ -n "${http_proxy:-}" ]; then ARGS+=( -e "http_proxy=${http_proxy}" ); fi
  if [ -n "${https_proxy:-}" ]; then ARGS+=( -e "https_proxy=${https_proxy}" ); fi
  if [ -n "${GAROON_PFX_FILE_PATH:-}" ] && [ -n "${GAROON_PFX_FILE_PASSWORD:-}" ]; then
    ARGS+=( -e "GAROON_PFX_FILE_PATH=${GAROON_PFX_FILE_PATH}" )
    ARGS+=( -e "GAROON_PFX_FILE_PASSWORD=${GAROON_PFX_FILE_PASSWORD}" )
  fi

  if [ -n "${GAROON_BASIC_AUTH_USERNAME:-}" ] && [ -n "${GAROON_BASIC_AUTH_PASSWORD:-}" ]; then
    ARGS+=( -e "GAROON_BASIC_AUTH_USERNAME=${GAROON_BASIC_AUTH_USERNAME}" )
    ARGS+=( -e "GAROON_BASIC_AUTH_PASSWORD=${GAROON_BASIC_AUTH_PASSWORD}" )
  fi

  if [ -n "${GAROON_PUBLIC_ONLY:-}" ]; then
    ARGS+=( -e "GAROON_PUBLIC_ONLY=${GAROON_PUBLIC_ONLY}" )
  fi
fi

pnpm exec mcp-inspector "${ARGS[@]}" tsx src/index.ts
