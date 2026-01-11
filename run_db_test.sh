#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "🧪 Running DB Test (Expected failure if impact column missing)..."
node test-db.mjs || echo "✅ Test failed as expected (column missing)"
