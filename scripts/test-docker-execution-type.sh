#!/bin/bash

# Test script to verify Docker execution type
# Usage: ./scripts/test-docker-execution-type.sh

set -e

echo "=== Testing Docker Execution Type ==="

# Build Docker image
echo "🔨 Building Docker image..."
bin/docker-build.sh

# Test execution type in Docker container
echo "🧪 Testing execution type in Docker container..."
docker run --rm garoon-mcp-server:latest scripts/inspect-container.mjs

# Verify execution type is 'docker' by checking the inspect output
echo "✅ Verifying Docker execution type..."
INSPECT_OUTPUT=$(docker run --rm garoon-mcp-server:latest scripts/inspect-container.mjs)

if echo "$INSPECT_OUTPUT" | grep -q "EXECUTION_TYPE: docker"; then
  echo "✅ Docker execution type test PASSED"
else
  echo "❌ Docker execution type test FAILED"
  echo "Expected 'EXECUTION_TYPE: docker' in output:"
  echo "$INSPECT_OUTPUT"
  exit 1
fi

echo "=== Docker test completed successfully ==="
