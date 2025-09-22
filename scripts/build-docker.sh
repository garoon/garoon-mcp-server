#!/bin/bash

tag=${TAG:-latest}
REPO_DIR=$(cd $(dirname $0)/..; pwd)

docker build -t garoon-mcp-server:${tag} --no-cache -f ${REPO_DIR}/Dockerfile ./

docker image prune -f
docker builder prune -f