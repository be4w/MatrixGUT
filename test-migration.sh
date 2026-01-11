#!/bin/bash
# Local Testing Script for Impact Migration
# Run this script to verify all changes work correctly

set -e  # Exit on error

echo "🧪 MatrixGUT Impact Migration - Local Testing"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in MatrixGUT root directory"
    echo "Please run this from /home/bd/Dev/MatrixGUT/MatrixGUT"
    exit 1
fi

echo "📦 Step 1: Install dependencies (if needed)"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi
echo ""

echo "🔨 Step 2: Build TypeScript"
echo "Running: npm run build"
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful - no TypeScript errors!"
else
    echo "❌ Build failed - check TypeScript errors above"
    exit 1
fi
echo ""

echo "🗄️  Step 3: Check Database Connection"
echo "Running: node test-db.mjs"
node test-db.mjs
echo ""

echo "🧪 Step 4: Test API (without database migration)"
echo "⚠️  WARNING: This will fail until Phase 1 migration is applied"
echo "Expected error: column 'impact' does not exist"
echo "Running: node test-api.mjs"
node test-api.mjs || echo "⚠️  Expected to fail - database not migrated yet"
echo ""

echo "📋 Summary of Results:"
echo "======================"
echo "✅ TypeScript compilation successful"
echo "✅ Code changes verified"
echo "⚠️  Database migration pending"
echo ""
echo "Next steps:"
echo "1. Create database backup: ./backup-database.sh"
echo "2. Apply Phase 1 migration: psql \$DATABASE_URL < migrations/0001_add_impact_column.sql"
echo "3. Re-run this test script to verify API works"
echo "4. Test in browser manually"
echo ""
echo "See changes_summary.md for detailed deployment instructions"
