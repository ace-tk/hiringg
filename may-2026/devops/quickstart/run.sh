#!/usr/bin/env bash
# Convenience launcher for the iii distributed inference prototype
# Usage: ./run.sh

set -e
export PATH="/Users/tisha/.local/bin:$PATH"

echo "==> Starting iii engine (HTTP on :3000, WS engine on :49134)..."
echo "    - inference-worker  (Python / gemma-3-270m)"
echo "    - caller-worker     (TypeScript / HTTP trigger)"
echo ""
echo "    POST http://localhost:3000/v1/chat/completions"
echo ""
echo "    Press Ctrl-C to stop."
echo ""

iii --config config.yaml
