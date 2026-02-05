# PostgreSQL Backup Dashboard

A minimalist PostgreSQL backup dashboard with Cloudflare R2 storage, built with React + Vite and a jet black + green accent theme.

## 🚀 Features

- **Manual & Scheduled Backups** - Trigger backups on demand or set up automatic schedules
- **Database Connections** - Connect to Supabase (OAuth) or direct PostgreSQL (connection string)
- **Cloudflare R2 Storage** - Store backups securely with retention policies
- **Dashboard UI** - Linear-inspired, minimalist design with sharp edges
- **Better-Auth** - Username/password authentication
- **Real-time Monitoring** - Backup status, success rates, storage usage
- **Restore Functionality** - Restore from any backup to your database

## 🎨 Tech Stack

### Frontend
- **Framework:** React 18+ with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (custom theme)
- **Routing:** TanStack Router
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Radix UI primitives (custom styled)
- **Authentication:** better-auth (username + password)

### Backend
- **Runtime:** Cloudflare Workers
- **Storage:** Cloudflare R2 (backup files)
- **Database:** Cloudflare KV (backup logs)
- **Postgres Client:** neon/postgres
- **Database:** PostgreSQL (Supabase or direct connection)
- **Scheduling:** Cloudflare Cron Triggers
- **Email:** SMTP integration for notifications

### Design System
- **Background:** Jet black (#000000)
- **Accent:** Electric green (#00ff00)
- **Surface:** Slightly lighter black (#0a0a0a)
- **Borders:** Dark gray (#1a1a1a)
- **Text:** Light gray (#e5e5e5) for secondary
- **Success:** Green (#22c55e)
- **Error:** Red (#ef4444)
- **Border Radius:** 0px everywhere (no rounded corners)

### Deployment
- **Frontend:** Cloudflare Pages
- **Backend:** Cloudflare Workers
- **Custom Domain:** (optional)

## 📋 Project Structure

```
postgres-backup-dashboard/
├── apps/
│   ├── web/                 # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── lib/
│   │   │   ├── styles/
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   └── package.json
│   └── worker/              # Cloudflare Worker backend
│       ├── src/
│       │   ├── routes/
│       │   ├── lib/
│       │   └── index.ts
│       ├── wrangler.toml
│       └── package.json
├── PLAN.md                              # Complete technical plan
├── ROADMAP.md                            # Phase-by-phase tasks
├── UI-MOCKUPS.md                        # Detailed UI designs
├── ASSUMPTIONS-TO-VERIFY.md             # Assumptions to test
├── VERIFICATION-SPRINT.md               # Test plan (ACTIVE)
├── STATUS.md                             # Current project state
├── STITCH-MCP-SETUP.md                   # Stitch API setup guide
├── STITCH-EXPORT-SUMMARY.md               # Exported designs summary
└── postgres-backup-dashboard-stitch-exports.tar.gz  # Stitch exports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm installed
- Cloudflare account with Workers free tier
- Cloudflare R2 bucket created
- Cloudflare KV namespace created
- PostgreSQL database available for testing (Supabase or direct)

### Installation

```bash
# Clone repository
git clone https://github.com/0xzapata/postgres-backup-dashboard.git
cd postgres-backup-dashboard

# Install dependencies
npm install

# Install Cloudflare CLI (if needed)
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Configure Wrangler
npx wrangler init
```

### Configuration

**Create `.env` file:**
```bash
# Cloudflare
CLOUDFLARE_API_TOKEN=your-token-here
CLOUDFLARE_ACCOUNT_ID=your-account-id

# Authentication
BETTER_AUTH_SECRET=your-secret-here

# PostgreSQL (if not using Supabase)
DATABASE_URL=postgresql://user:password@host:port/database

# R2 Storage
R2_BUCKET_NAME=postgres-backups

# KV Namespace
KV_NAMESPACE_ID=your-kv-namespace-id
```

### Development

```bash
# Install dependencies
npm install

# Start frontend (development)
npm run dev

# Start backend (development)
npx wrangler dev

# Run type checking
npm run type-check
```

### Building for Production

```bash
# Build frontend
npm run build

# Deploy backend
npx wrangler deploy

# Deploy frontend
npm run deploy
```

## 🎨 Design System

### Color Palette
```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--border: #1a1a1a;
--text-primary: #e5e5e5;
--text-secondary: #a3a3a3;
--accent: #00ff00;
--success: #22c55e;
--error: #ef4444;
```

### Typography
```css
font-family: 'Inter', system-ui, sans-serif;
font-weights: 400, 500, 600, 700, 900;
```

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
```

### Border Radius
```css
--radius-none: 0px; /* All corners sharp */
```

### Shadows
```css
/* Minimalist - mostly no shadows */
box-shadow: none;
```

## 📖 Usage

### Adding a Database Connection

1. Navigate to Dashboard
2. Click "Add Database"
3. Choose connection type:
   - **Supabase:** Click "Connect with Supabase" and authorize
   - **Direct PostgreSQL:** Enter connection string manually
4. Test connection
5. Save configuration

### Creating a Backup

1. Navigate to database detail page
2. Click "Backup Now" button
3. Monitor progress in real-time
4. Backup appears in history when complete

### Scheduling Backups

1. Go to database detail page
2. Click "Schedules" tab
3. Add new schedule
4. Configure cron expression (e.g., `0 2 * * *` for every 2 hours)
5. Set timezone
6. Enable/disable schedule

### Restoring a Backup

1. Go to "All Backups" page
2. Find desired backup
3. Click "Restore" button
4. Select target database
5. Monitor restore progress

## 🔐 Authentication

Uses **better-auth** for username/password authentication.

**Setup:**
1. Generate secret: `openssl rand -base64 32`
2. Set `BETTER_AUTH_SECRET` environment variable
3. Configure session storage (Cloudflare KV)

## 🌐 Deployment

### Cloudflare Workers
```bash
npx wrangler deploy worker
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist
```

### Custom Domain
```bash
npx wrangler pages deploy dist --project-name=postgres-backups
```

## 📊 Monitoring & Logging

- Backup status logged to Cloudflare KV
- Success/failure tracking
- Storage usage monitoring
- Error alerts via email

## 🧪 Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed phase-by-phase implementation plan.

## 📄 Documentation

- [PLAN.md](PLAN.md) - Complete technical architecture
- [ROADMAP.md](ROADMAP.md) - Phase-by-phase tasks
- [UI-MOCKUPS.md](UI-MOCKUPS.md) - Detailed UI designs
- [ASSUMPTIONS-TO-VERIFY.md](ASSUMPTIONS-TO-VERIFY.md) - Assumptions to verify

## 🤝 Contributing

This is a personal project, but contributions and suggestions are welcome.

## 📜 License

MIT License - see LICENSE file for details.

---

**Built with:** ❤️ + 🦞 (Larry's recommendation)
**Design:** Linear-inspired with jet black & electric green accent
**Powered by:** Cloudflare Workers + R2 + better-auth

---

*Ready to back up your PostgreSQL databases with style.* ✅
