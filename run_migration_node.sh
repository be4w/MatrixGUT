#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "📦 Running Node.js Backup..."
node backup-db-node.js

echo "🚀 Running Node.js Migration..."
node migrate-db-node.js
