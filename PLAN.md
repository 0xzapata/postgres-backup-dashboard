# PostgreSQL Backup Dashboard - Project Plan

## Overview
A minimalist, high-performance PostgreSQL backup dashboard using Cloudflare Workers + R2 for storage, with KV for logs and a sleek React frontend.

## Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS (custom jet black theme + green accent)
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI primitives (custom styled, no rounded corners)
- **Authentication**: better-auth (username + password)

### Backend (Cloudflare Workers)
- **Runtime**: Cloudflare Workers
- **Storage**: Cloudflare R2 (backup files)
- **Database**: Cloudflare KV (backup logs)
- **ORM/DB Client**: Drizzle ORM for schema (if needed)
- **Postgres Connection**: neon/postgres (for direct connections)
- **Cron**: Cloudflare Cron Triggers

## Core Features

### 1. Authentication
- [ ] Username/password login
- [ ] Session management via better-auth
- [ ] CSRF protection
- [ ] Rate limiting on auth endpoints

### 2. Database Connection Management
- [ ] **Supabase Integration**
  - OAuth flow or service key
  - Auto-discover database credentials
  - Connection testing

- [ ] **Direct PostgreSQL Connection**
  - Connection string input (masked)
  - Service account key support
  - SSL/TLS configuration options
  - Connection pool settings

- [ ] **Connection Health Checks**
  - Test connection button
  - Latency monitoring
  - Auto-reconnect logic

### 3. Backup Operations
- [ ] **Manual Backup**
  - One-click backup trigger
  - Progress indicator
  - Real-time pg_dump status streaming

- [ ] **Scheduled Backups**
  - Cron expression editor
  - Timezone support
  - Multiple schedules per database
  - Enable/disable individual schedules

- [ ] **Backup Settings per Database**
  - Compression level (gzip/zstd)
  - Custom pg_dump options
  - Schema/table inclusion/exclusion
  - Backup retention policy (days/weeks/months)

### 4. Storage (Cloudflare R2)
- [ ] Bucket management
- [ ] File organization: `{database-id}/{timestamp}/{backup-file}.sql.gz`
- [ ] Metadata storage in KV
- [ ] Automatic cleanup based on retention policy
- [ ] Storage quota tracking

### 5. Backup Logs & Monitoring
- [ ] **KV-Based Logging**
  - Backup ID, timestamp, status, size, duration
  - Error messages and stack traces
  - Per-database log history

- [ ] **Dashboard Metrics**
  - Total backups, success rate
  - Storage usage trend
  - Backup duration charts
  - Last backup status per database

- [ ] **Alerts**
  - Failed backup notifications (email/webhook)
  - Storage quota warnings
  - Long-running backup alerts

### 6. Restore Operations
- [ ] **Browse Backups**
  - List all backups per database
  - Filter by date/status
  - Preview backup metadata

- [ ] **Restore**
  - One-click restore (to same DB)
  - Restore to different database
  - Download backup file
  - Progress tracking for restore

### 7. UI Design System
- [ ] **Color Palette**
  - Background: `#000000` (pure black)
  - Card backgrounds: `#0a0a0a` (slightly lighter)
  - Borders: `#1a1a1a`
  - Text: `#e5e5e5` (primary), `#a3a3a3` (secondary)
  - Accent: `#00ff00` (electric green)
  - Success: `#22c55e`
  - Error: `#ef4444`
  - Warning: `#eab308`

- [ ] **Design Rules**
  - NO rounded corners (0px border-radius everywhere)
  - Sharp edges only
  - Thin 1px borders
  - Monospace fonts for data
  - Subtle hover states
  - Minimal shadows, flat design
  - Grid layouts for data

## Database Schema (KV Structure)

### `backup-logs:{backup-id}`
```json
{
  "id": "uuid",
  "databaseId": "uuid",
  "status": "success|failed|running",
  "startTime": "ISO-8601",
  "endTime": "ISO-8601",
  "duration": 12345,
  "size": 52428800,
  "r2Key": "db-id/timestamp/backup.sql.gz",
  "error": null,
  "scheduleId": null
}
```

### `database-configs:{database-id}`
```json
{
  "id": "uuid",
  "name": "production-db",
  "type": "supabase|direct",
  "connection": {
    "connectionString": "encrypted",
    "supabaseUrl": "https://xxx.supabase.co",
    "supabaseKey": "encrypted"
  },
  "settings": {
    "compression": "gzip|zstd",
    "retentionDays": 30,
    "customOptions": "--data-only"
  },
  "createdAt": "ISO-8601",
  "lastBackup": "ISO-8601",
  "healthStatus": "healthy|unhealthy|unknown"
}
```

### `schedules:{schedule-id}`
```json
{
  "id": "uuid",
  "databaseId": "uuid",
  "cronExpression": "0 2 * * *",
  "timezone": "UTC",
  "enabled": true,
  "nextRun": "ISO-8601",
  "lastRun": "ISO-8601"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Databases
- `GET /api/databases` - List all databases
- `POST /api/databases` - Add new database connection
- `GET /api/databases/:id` - Get database details
- `PUT /api/databases/:id` - Update database config
- `DELETE /api/databases/:id` - Remove database
- `POST /api/databases/:id/test` - Test connection

### Backups
- `POST /api/databases/:id/backup` - Trigger manual backup
- `GET /api/databases/:id/backups` - List backups
- `GET /api/backups/:id` - Get backup details
- `DELETE /api/backups/:id` - Delete backup
- `POST /api/backups/:id/download` - Get download URL

### Schedules
- `GET /api/databases/:id/schedules` - List schedules
- `POST /api/databases/:id/schedules` - Add schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `POST /api/schedules/:id/toggle` - Enable/disable

### Restore
- `POST /api/backups/:id/restore` - Restore backup
- `POST /api/backups/:id/restore-to` - Restore to different DB

### Dashboard
- `GET /api/stats` - Overall statistics
- `GET /api/recent-backups` - Recent backup activity

## Project Structure

```
postgres-backup-dashboard/
├── apps/
│   ├── web/                 # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── styles/
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   └── worker/              # Cloudflare Worker
│       ├── src/
│       │   ├── routes/      # API route handlers
│       │   ├── lib/         # Utilities (R2, KV, Postgres)
│       │   ├── middleware/  # Auth, rate limiting
│       │   └── index.ts     # Entry point
│       ├── wrangler.toml
│       └── package.json
├── packages/
│   ├── config/              # Shared configs (TS, ESLint)
│   ├── types/               # Shared TypeScript types
│   └── ui/                  # Shared UI components
├── turbo.json               # Turborepo config
└── package.json
```

## Recommended Vite + React Starter

**Option 1: T3 Stack Cloudflare Edition** (if available)
- Pre-configured with TypeScript, Tailwind
- Easy to adapt for Cloudflare

**Option 2: Create Vite from Scratch** (Recommended)
- More control, less bloat
- Use `npm create vite@latest` with `react-ts`
- Add Tailwind manually
- Configure for Cloudflare Workers deployment

**Option 3: Hono + Vite**
- Hono has Cloudflare Workers support
- Can serve both API and static assets
- Good edge performance

## Additional Features to Consider (MVP vs Future)

### MVP (Must Have)
- [x] Authentication
- [x] Add Supabase/Direct PostgreSQL connections
- [x] Manual backup trigger
- [x] Scheduled backups
- [x] R2 storage
- [x] KV logging
- [x] Backup list view
- [x] Download backups
- [x] Minimalist UI (black + green, no radius)

### V1.0 (Should Have)
- [ ] Restore functionality
- [ ] Backup compression options
- [ ] Retention policies with auto-cleanup
- [ ] Connection health monitoring
- [ ] Email notifications (using Cloudflare Email Routing or SendGrid)
- [ ] Storage quota tracking
- [ ] Dashboard statistics
- [ ] Backup size/duration metrics

### V1.5+ (Nice to Have)
- [ ] **Backup Encryption**
  - AES-256-GCM encryption at rest
  - Customer-managed encryption keys

- [ ] **Backup Verification**
  - Automatic restore to test DB
  - Schema validation post-restore
  - Data integrity checks

- [ ] **Advanced Scheduling**
  - Multiple schedules per DB (daily/weekly/monthly)
  - Backup chain support (full + incremental)
  - Pause/resume schedules

- [ ] **Multi-destination Support**
  - Backup to R2 + S3 + local
  - Cross-region replication

- [ ] **Team/User Management**
  - Invite team members
  - Role-based access control (admin/viewer)
  - Activity audit log

- [ ] **Webhook Integrations**
  - Slack/Discord notifications
  - Custom webhook triggers
  - PagerDuty/OpsGenie alerts

- [ ] **Database Comparison**
  - Compare backup vs live DB schema
  - Row count verification
  - Data diff preview

- [ ] **Performance Optimization**
  - Parallel dump for large tables
  - Streaming backups (no intermediate files)
  - Bandwidth throttling

- [ ] **CLI Tool**
  - Trigger backups from CLI
  - Sync configuration
  - Automated deployment scripts

## Deployment Strategy

1. **Frontend**: Cloudflare Pages (automatic from GitHub)
2. **Backend**: Cloudflare Workers (Wrangler CLI)
3. **R2 Bucket**: Cloudflare R2 (single bucket)
4. **KV Namespace**: Cloudflare KV (single namespace)
5. **Custom Domain**: Configure in Cloudflare

## Security Considerations

- Encrypt database connection strings at rest (using Cloudflare D1 or separate KV)
- Use environment variables for sensitive data (wrangler secret)
- Implement rate limiting on all endpoints
- CORS restrictions for API
- Input validation with Zod
- SQL injection prevention (parameterized queries)
- Audit logging for all critical actions

## My Recommendations (What Else to Add?)

Based on the core requirements, here's what I'd prioritize:

### Top Priority (Add to MVP)
1. **Restore functionality** - Backups without restore are incomplete
2. **Backup size tracking** - Essential for storage management
3. **Connection health checks** - User feedback on DB status
4. **Email notifications** - Know when backups fail
5. **Retention policies** - Auto-cleanup old backups

### High Value (V1.0)
1. **Backup encryption** - Security best practice for sensitive data
2. **Multiple schedules per DB** - Flexibility
3. **Storage quota alerts** - Prevent surprise costs
4. **Dashboard analytics** - Visual insights
5. **Download/Stream backups** - Quick access

### Future Considerations
1. **Incremental backups** - For large databases
2. **Point-in-time recovery** - Using WAL logs
3. **Cross-cloud replication** - DR scenario
4. **Backup marketplace** - Share templates with team

## Development Phases

### Phase 1: Foundation (Week 1)
- Set up monorepo (Turbo)
- Configure Cloudflare Workers + Pages
- Set up authentication (better-auth)
- Build UI skeleton with design system
- Configure R2 + KV

### Phase 2: Core Features (Week 2)
- Database connection management
- Manual backup implementation
- R2 upload/download
- KV logging
- Backup listing

### Phase 3: Scheduling (Week 3)
- Cloudflare Cron integration
- Schedule CRUD operations
- Next run calculation
- Background job processing

### Phase 4: Restore & Polish (Week 4)
- Restore functionality
- Email notifications
- Dashboard metrics
- Error handling improvements
- Testing & documentation

## Environment Variables Needed

```
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
R2_BUCKET_NAME=postgres-backups
KV_NAMESPACE_ID=xxx

# Authentication
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://your-domain.com

# Email (for notifications)
SMTP_HOST=xxx
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx

# Encryption (optional)
ENCRYPTION_KEY=xxx
```

## Next Steps

1. ✅ Create GitHub repository
2. Set up Cloudflare account & resources (R2, KV)
3. Initialize monorepo with Turborepo
4. Build authentication system
5. Implement database connection manager
6. Build backup pipeline
7. Create scheduling system
8. Polish UI and deploy

Let me know which features you want in MVP vs V1.0, and I can start building!
