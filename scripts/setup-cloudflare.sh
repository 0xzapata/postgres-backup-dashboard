#!/bin/bash

# Cloudflare Resources Setup Script
# This script helps set up the necessary Cloudflare resources

echo "🚀 Setting up Cloudflare resources for PostgreSQL Backup Dashboard"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Installing..."
    npm install -g wrangler
fi

echo "✓ Wrangler CLI is installed"
echo ""

# Authenticate with Cloudflare
echo "🔐 Please authenticate with Cloudflare:"
echo "   Run: wrangler login"
echo ""

# Create R2 bucket
echo "📦 Creating R2 bucket..."
npx wrangler r2 bucket create postgres-backups || echo "   Bucket may already exist"
echo ""

# Create KV namespace
echo "🗂️  Creating KV namespace..."
npx wrangler kv:namespace create "BACKUP_LOGS" || echo "   Namespace may already exist"
echo ""

# Set secrets
echo "🔑 Setting secrets..."
echo "   Please set these secrets manually:"
echo "   - BETTER_AUTH_SECRET: Generate a random string"
echo "   - DATABASE_ENCRYPTION_KEY: Generate a random string"
echo ""
echo "   Commands:"
echo "   npx wrangler secret put BETTER_AUTH_SECRET"
echo "   npx wrangler secret put DATABASE_ENCRYPTION_KEY"
echo ""

echo "✅ Setup complete! Update wrangler.toml with your KV namespace ID"
echo ""
echo "📝 Next steps:"
echo "   1. Update wrangler.toml with the KV namespace ID"
echo "   2. Set the required secrets"
echo "   3. Deploy the worker: npm run deploy"
