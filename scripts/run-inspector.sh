#!/bin/bash

cd "$(dirname $0)/.."

if [ -f .env.local ]; then
  source .env.local
  if [ -n "${GAROON_PFX_FILE_PATH}" ] && [ -n "${GAROON_PFX_FILE_PASSWORD}" ]; then
    npx @modelcontextprotocol/inspector \
      -e GAROON_BASE_URL=${GAROON_BASE_URL} \
      -e GAROON_USERNAME=${GAROON_USERNAME} \
      -e GAROON_PASSWORD=${GAROON_PASSWORD} \
      -e http_proxy=${http_proxy} \
      -e https_proxy=${https_proxy} \
      -e GAROON_PFX_FILE_PATH=${GAROON_PFX_FILE_PATH} \
      -e GAROON_PFX_FILE_PASSWORD=${GAROON_PFX_FILE_PASSWORD} \
      tsx src/index.ts
  elif [ -n "${http_proxy}" ] && [ -n "${https_proxy}" ]; then
      npx @modelcontextprotocol/inspector \
        -e GAROON_BASE_URL=${GAROON_BASE_URL} \
        -e GAROON_USERNAME=${GAROON_USERNAME} \
        -e GAROON_PASSWORD=${GAROON_PASSWORD} \
        -e http_proxy=${http_proxy} \
        -e https_proxy=${https_proxy} \
        tsx src/index.ts
  else
      npx @modelcontextprotocol/inspector \
        -e GAROON_BASE_URL=${GAROON_BASE_URL} \
        -e GAROON_USERNAME=${GAROON_USERNAME} \
        -e GAROON_PASSWORD=${GAROON_PASSWORD} \
        tsx src/index.ts
  fi
else
  npx @modelcontextprotocol/inspector tsx src/index.ts
fi
