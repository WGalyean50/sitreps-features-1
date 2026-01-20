#!/bin/bash
set -euo pipefail

# Sitreps.com Redesign - Environment Initialization

echo "Initializing Sitreps development environment..."

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
  echo "Installing dependencies..."
  npm install 2>/dev/null || true
fi

# Start dev server in background if Next.js project exists
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ] || [ -f "next.config.ts" ]; then
  echo "Starting Next.js dev server..."
  npm run dev &
  sleep 3
  echo "Dev server running at http://localhost:3000"
fi

echo "Agent memory environment ready"
