# Quick Start

## For Development

```bash
# 1. Navigate to project
cd /home/ubuntu/clawd/postgres-backup-dashboard

# 2. Install dependencies
npm install

# 3. Start frontend (Terminal 1)
cd apps/web
npm run dev
# Opens at http://localhost:5173

# 4. Start backend (Terminal 2)
cd apps/worker
npm run dev
# Runs at http://localhost:8787
```

## For Production Deployment

```bash
# 1. Set up Cloudflare resources
./scripts/setup-cloudflare.sh

# 2. Configure wrangler.toml with your KV namespace ID
# Edit apps/worker/wrangler.toml

# 3. Set secrets
cd apps/worker
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put DATABASE_ENCRYPTION_KEY

# 4. Deploy
./scripts/deploy.sh
```

## What's Ready

✅ Dashboard UI with mock data
✅ All 4 main pages (Dashboard, Database Detail, Schedules, Settings)
✅ Backend API with core endpoints
✅ UI component library (Buttons, Cards, Tables, Badges, etc.)
✅ Custom design system (jet black + electric green)
✅ Documentation (README, API docs, Getting Started guide)

## What Needs Implementation

🔶 Real PostgreSQL connections (currently mocked)
🔶 Authentication with better-auth
🔶 Actual R2 file uploads
🔶 Cloudflare Cron for scheduled backups
🔶 Email notifications

## Next Steps

1. Review the code in `apps/web/src/pages/Dashboard.tsx`
2. Check the API in `apps/worker/src/index.ts`
3. Read `GETTING-STARTED.md` for detailed setup
4. Run the verification sprint tests from `VERIFICATION-SPRINT.md`

---

For questions, see:
- **README.md** - Project overview
- **GETTING-STARTED.md** - Detailed setup guide
- **API.md** - API documentation
- **BUILD-COMPLETE.md** - Full build summary
