#!/bin/bash
# Production Deployment Script for MatrixGUT
# Handles database migration and triggers Vercel deployment

echo "🚀 MatrixGUT Production Deployment"
echo "=================================="

# Check for required tools
if ! command -v git &> /dev/null; then
    echo "❌ git is required but not installed."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ node is required but not installed."
    exit 1
fi

echo ""
echo "📦 Step 1: Database Migration"
echo "----------------------------"
echo "You need to apply the 'impact' column migration to your production database."
echo "Running this requires the DATABASE_URL environment variable to be set for PROD."
echo ""
echo "Do you want to run the database migration now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    if [ -z "$DATABASE_URL" ]; then
        echo "⚠️  DATABASE_URL is not set."
        echo "Please paste your Production Connection String (postgres://...):"
        read -r db_url
        if [ -n "$db_url" ]; then
            export DATABASE_URL="$db_url"
        else
            echo "❌ No connection string provided. Skipping migration."
            echo "⚠️  CRITICAL: Deployment will fail or error if DB is not migrated!"
        fi
    fi

    if [ -n "$DATABASE_URL" ]; then
        echo "🔄 Applying migration..."
        # Create a temporary script that uses the full migration file
        # ensure we use the file provided in repo
        node migrate-db-node.js
        if [ $? -eq 0 ]; then
             echo "✅ Database migration successful!"
        else
             echo "❌ Database migration failed. Check credentials and try again."
             exit 1
        fi
    fi
else
    echo "⚠️  Skipping database migration. Ensure you run it manually!"
fi

echo ""
echo "🚀 Step 2: Vercel Deployment"
echo "---------------------------"
echo "Deploying via git..."
echo ""

# Ensure we are on main/master
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

echo "Staging changes..."
git add .

echo "Committing changes..."
# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "No changes to commit."
else
    echo "Enter commit message (default: 'feat: migrate gravity to impact'):"
    read -r commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="feat: migrate gravity to impact"
    fi
    git commit -m "$commit_msg"
fi

echo "Pushing to remote..."
git push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code pushed successfully!"
    echo "👀 Watch Vercel dashboard for deployment status."
else
    echo "❌ Git push failed. Please check your remote settings."
fi

echo ""
echo "🎉 Deployment sequence complete!"
