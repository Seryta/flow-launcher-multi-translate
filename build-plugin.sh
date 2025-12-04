#!/bin/bash

set -e

echo "Building Flow Launcher Multi-Translate plugin..."

# Build Docker image
docker build -t flow-launcher-multi-translate-builder .

# Run container and extract the zip file
docker run --rm -v "$(pwd):/workspace" flow-launcher-multi-translate-builder

echo "Build complete! Plugin package: flow-launcher-multi-translate.zip"
