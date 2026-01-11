#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "🚀 Starting server in background..."
npm run dev > server.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to start (10s)..."
sleep 10

echo "🧪 Running API Test..."
node test-api.mjs
TEST_EXIT_CODE=$?

echo "🛑 Stopping server (PID: $SERVER_PID)..."
kill $SERVER_PID

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ API Test Passed!"
    exit 0
else
    echo "❌ API Test Failed. Server logs:"
    cat server.log
    exit 1
fi
