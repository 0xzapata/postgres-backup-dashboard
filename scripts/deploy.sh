#!/bin/bash

# Deployment Script
# This script builds and deploys both frontend and backend

echo "🚀 Deploying PostgreSQL Backup Dashboard"
echo ""

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build frontend
echo "🏗️  Building frontend..."
cd apps/web
npm install
npm run build
cd ../..
echo ""

# Deploy backend
echo "☁️  Deploying backend to Cloudflare Workers..."
cd apps/worker
npm install
npm run deploy
cd ../..
echo ""

# Deploy frontend
echo "🌐 Deploying frontend to Cloudflare Pages..."
echo "   Choose 'Create new project' when prompted"
echo "   Set the directory to: apps/web/dist"
echo ""
npx wrangler pages deploy apps/web/dist
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Cloudflare Pages"
echo "   2. Configure custom domain (optional)"
echo "   3. Add database connections in the dashboard"
