# Getting Started Guide

This guide will help you set up and run the PostgreSQL Backup Dashboard locally and deploy it to production.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18 or higher installed
- npm or yarn package manager
- A Cloudflare account (free tier is sufficient)
- A PostgreSQL database you want to back up (or a free Supabase project)
- Git installed (for cloning the repository)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/0xzapata/postgres-backup-dashboard.git
cd postgres-backup-dashboard

# Install all dependencies (this uses workspaces)
npm install
```

## Step 2: Local Development

### Option A: Run Everything Together

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd apps/web
npm run dev
```
The frontend will be available at http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd apps/worker
npm run dev
```
The backend will be available at http://localhost:8787

### Option B: Use Turborepo

From the root directory:
```bash
npm run dev
```

This will start both frontend and backend in parallel.

## Step 3: Set Up Cloudflare Resources

You need to set up Cloudflare R2 and KV before deploying.

### 3.1 Install Wrangler CLI

```bash
npm install -g wrangler
```

### 3.2 Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window where you can authorize Wrangler.

### 3.3 Create R2 Bucket

```bash
npx wrangler r2 bucket create postgres-backups
```

### 3.4 Create KV Namespace

```bash
npx wrangler kv:namespace create "BACKUP_LOGS"
```

You'll get an output like:
```
🌀 Creating namespace with title "postgres-backup-dashboard-worker-BACKUP_LOGS"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "BACKUP_LOGS", id = "abc123def456", preview_id = "xyz789" }
```

**Important:** Copy the `id` and `preview_id` values and update `apps/worker/wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "BACKUP_LOGS"
id = "YOUR_ID_HERE"
preview_id = "YOUR_PREVIEW_ID_HERE"
```

### 3.5 Set Secrets

Generate random secret values for security:

```bash
# Generate random strings
openssl rand -base64 32  # Use this for both secrets

# Set secrets
npx wrangler secret put BETTER_AUTH_SECRET
# Paste the random string when prompted

npx wrangler secret put DATABASE_ENCRYPTION_KEY
# Paste a different random string
```

## Step 4: Configure Environment Variables

### For Local Development

Create `apps/web/.env.local`:

```env
VITE_API_URL=http://localhost:8787
```

### For Production

Create `apps/web/.env.production`:

```env
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev
```

## Step 5: Add Your First Database

1. Open http://localhost:5173 in your browser
2. Click the `＋ New DB` button
3. Choose your database type:
   - **Supabase**: Enter your Supabase project URL and service key
   - **Direct PostgreSQL**: Enter your connection string
4. Click "Test Connection" to verify
5. Click "Save" to add the database

## Step 6: Create a Backup Schedule

1. Click on your newly added database in the dashboard
2. Click "View Schedules"
3. Click "＋ Add"
4. Configure:
   - **Name**: e.g., "Daily Backup"
   - **Frequency**: e.g., "Every 2 hours"
   - **Timezone**: Your preferred timezone
   - **Notifications**: Enable email alerts on failure
5. Click "Save"

## Step 7: Test Your First Backup

From the database detail page:

1. Click "Backup Now"
2. Watch the progress indicator
3. Once complete, you'll see the backup in the history

## Production Deployment

### Deploy Backend (Worker)

```bash
cd apps/worker
npm run deploy
```

Wrangler will deploy your worker and give you a URL like:
```
https://postgres-backup-dashboard-worker.your-subdomain.workers.dev
```

**Note this URL** - you'll need it for the frontend configuration.

### Deploy Frontend (Pages)

```bash
cd apps/web
npm run build
npx wrangler pages deploy dist
```

Wrangler will:
1. Ask you to create a new project (or link to an existing one)
2. Upload your built files
3. Give you a URL like:
   ```
   https://postgres-backup-dashboard.pages.dev
   ```

### Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages
2. Select your project
3. Go to Custom Domains
4. Add your domain
5. Update DNS records as instructed

### Update Frontend Environment

Update `apps/web/.env.production` with your actual worker URL:

```env
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev
```

Rebuild and redeploy the frontend:

```bash
cd apps/web
npm run build
npx wrangler pages deploy dist
```

## Common Issues and Solutions

### Issue: "KV namespace not found"

**Solution:** Make sure you've created the KV namespace and updated `wrangler.toml` with the correct ID.

### Issue: "CORS errors when calling API"

**Solution:** Check that the CORS origin in the worker (`apps/worker/src/index.ts`) includes your frontend URL.

### Issue: "Connection timeout when testing database"

**Solution:** 
- Verify your connection string is correct
- Check if your database allows connections from Cloudflare IPs
- For Supabase, make sure you're using the service key, not the anon key

### Issue: "Backups failing with 500 error"

**Solution:** Check the worker logs:
```bash
npx wrangler tail
```

## Monitoring and Maintenance

### View Worker Logs

```bash
cd apps/worker
npx wrangler tail
```

### Check R2 Storage

```bash
# List all objects in bucket
npx wrangler r2 object list postgres-backups

# Get bucket stats
npx wrangler r2 bucket info postgres-backups
```

### Check KV Data

```bash
# List all keys
npx wrangler kv key list --namespace-id=YOUR_NAMESPACE_ID --prefix=backup:

# Get a specific value
npx wrangler kv key get "backup:YOUR_BACKUP_ID" --namespace-id=YOUR_NAMESPACE_ID
```

## Security Best Practices

1. **Never commit secrets** - Use `wrangler secret put` for sensitive values
2. **Rotate secrets regularly** - Update your auth and encryption keys periodically
3. **Use strong passwords** - For database connections
4. **Enable HTTPS** - Cloudflare does this automatically
5. **Limit access** - Use Cloudflare Access or authentication tokens
6. **Monitor logs** - Regularly check for suspicious activity
7. **Backup your config** - Keep your database connections and schedules documented

## Next Steps

- [ ] Set up email notifications for backup failures
- [ ] Configure retention policies to auto-delete old backups
- [ ] Add more databases to monitor
- [ ] Set up custom domain for the dashboard
- [ ] Configure team access and permissions

## Support

If you run into issues:

1. Check the [GitHub Issues](https://github.com/0xzapata/postgres-backup-dashboard/issues)
2. Review the [Documentation](https://github.com/0xzapata/postgres-backup-dashboard)
3. Check Cloudflare's [Workers Documentation](https://developers.cloudflare.com/workers/)
4. Check Cloudflare's [R2 Documentation](https://developers.cloudflare.com/r2/)

Happy backing up! 🎉
