# Verification Sprint Plan

**Status:** 🔴 NOT STARTED
**Duration:** 3-5 days
**Goal:** Verify critical technical assumptions before full implementation

---

## Sprint Strategy

### Parallel Workstreams

**Stream 1: Critical Path Tests (Must Pass)**
- pg_dump in Cloudflare Workers
- better-auth on Workers
- Supabase connection flow
- R2 upload/download limits
- KV performance

**Stream 2: Build Skeleton (Can Proceed Even If Some Fail)**
- Initialize Turborepo
- Set up Tailwind + theme
- Basic component library
- Worker + Pages structure

---

## Day 1-2: Critical Assumption Tests

### Test 1: Cloudflare Workers & pg_dump
**Priority:** 🔴 HIGHEST

**What we're testing:**
- Can Workers spawn sub-processes?
- Does postgres client work in Workers runtime?
- Can we execute system commands (pg_dump)?

**Approach:**
```bash
# Create minimal Worker
npx wrangler init backup-test
cat > src/index.js << 'EOF'
export default {
  async fetch(request, env, ctx) {
    // Test postgres connection
    const { neon } = await import('neon/postgres');
    // Test pg_dump command
  }
}
EOF

# Deploy
npx wrangler deploy
```

**Success Criteria:**
- ✅ Worker can import postgres client
- ✅ Can connect to test database
- ❌ Sub-process execution expected to FAIL

**If FAIL → Pivot Plan A:**
- Use Supabase's backup API endpoint
- Or spawn short-lived compute instance

---

### Test 2: better-auth + Cloudflare Workers
**Priority:** 🔴 HIGH

**What we're testing:**
- Can better-auth run in Workers runtime?
- Does it support KV for session storage?
- Can it handle request/response model?

**Approach:**
```bash
# Create test Worker with better-auth
cat > test-auth.js << 'EOF'
import { betterAuth } from 'better-auth';

// Configure for Workers
const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: { provider: 'cloudflare-kv' }
});

export default {
  async fetch(request, env, ctx) {
    // Test auth flow
  const session = await auth.api.getSession(request);
    return new Response(JSON.stringify({ success: !!session }));
  }
}
EOF
```

**Success Criteria:**
- ✅ better-auth initializes in Worker
- ✅ Session can be stored/retrieved from KV
- ❌ Expected: KV storage should WORK

**If FAIL → Pivot Plan B:**
- Switch to Lucia Auth (Workers-native)
- Or custom JWT with KV

---

### Test 3: R2 Large File Upload
**Priority:** 🟡 MEDIUM

**What we're testing:**
- Can Workers handle 500MB+ uploads?
- What's the timeout limit?
- Do we need chunked uploads?

**Approach:**
```bash
# Test file sizes: 10MB, 100MB, 500MB, 1GB

# Use wrangler to upload
wrangler r2 object put backup-test-500mb.sql.gz \
  --bucket=postgres-backups \
  --file=large-test.sql.gz
```

**Success Criteria:**
- ✅ 100MB uploads work reliably
- ⚠️ 500MB may timeout
- ❌ 1GB expected to FAIL

**If FAIL → Pivot Plan C:**
- Use signed URLs + direct upload
- Or chunked upload implementation

---

### Test 4: KV Performance & Limits
**Priority:** 🟡 MEDIUM

**What we're testing:**
- How fast are KV reads/writes?
- What's the value size limit?
- Can we store 1000+ backup logs?

**Approach:**
```bash
# Benchmark KV operations
for i in {1..1000}; do
  wrangler kv key put "backup-log-$i" \
    --value="..." \
    --namespace=backup-logs
done

# Query test
time wrangler kv key list --namespace=backup-logs --prefix=backup-log
```

**Success Criteria:**
- ✅ 1000+ keys work
- ✅ Query time < 500ms
- ⚠️ Value size limit ~1MB (acceptable)

**If FAIL → Pivot Plan D:**
- Use Cloudflare D1 (SQLite) for metadata
- Store minimal in KV, full in R2

---

### Test 5: Supabase Connection
**Priority:** 🟢 LOW (Can be verified manually)

**What we're testing:**
- Does OAuth give us DB connection string?
- Can we connect directly via postgres client?
- What credentials format needed?

**Approach:**
```bash
# If user has Supabase project, test:
# 1. Check if OAuth token translates to connection string
# 2. Test neon/postgres client with Supabase DB
```

**Success Criteria:**
- ✅ Can get connection string from OAuth
- ✅ neon/postgres connects successfully
- ⚠️ May need manual connection string input

**If FAIL → Pivot Plan E:**
- Require manual connection string input
- Use Supabase REST API for backups

---

## Day 3-5: Build Skeleton (Parallel)

### What to Build (Regardless of Test Results)

**Minimal Viable Product:**
1. ✅ Working Auth system (better-auth OR pivot)
2. ✅ Database connection UI
3. ✅ Manual backup trigger
4. ✅ Backup listing from logs
5. ✅ UI with black/green theme

**Not Critical for MVP:**
- Automatic scheduling (can add later)
- Email notifications (can add later)
- Restore functionality (can add later)

---

## Day-by-Day Schedule

### Day 1
**Morning:**
- [ ] Set up Cloudflare account (if needed)
- [ ] Create R2 bucket
- [ ] Create KV namespace
- [ ] Start Test 1: Workers + pg_dump

**Afternoon:**
- [ ] Complete Test 1, document results
- [ ] Start Test 2: better-auth
- [ ] Create backup plan document

### Day 2
**Morning:**
- [ ] Complete Test 2, document results
- [ ] Start Test 3: R2 uploads
- [ ] Start Test 4: KV performance

**Afternoon:**
- [ ] Complete Tests 3 & 4
- [ ] Create pivot decision matrix
- [ ] Initialize Turborepo

### Day 3
**Morning:**
- [ ] Test 5: Supabase (if possible)
- [ ] Set up React + Vite
- [ ] Configure Tailwind theme

**Afternoon:**
- [ ] Build base components
- [ ] Create auth UI
- [ ] Create DB connection UI

### Day 4-5
- [ ] Build backup trigger flow
- [ ] Build backup listing
- [ ] Deploy to Cloudflare
- [ ] End-to-end test

---

## Pivot Decision Matrix

| Test | Pass | Impact | Pivot Needed |
|-------|-------|----------|--------------|
| Workers + pg_dump | ✅ | None | No |
| Workers + pg_dump | ❌ | CRITICAL | Plan A |
| better-auth + KV | ✅ | None | No |
| better-auth + KV | ❌ | HIGH | Plan B |
| R2 uploads (100MB) | ✅ | None | No |
| R2 uploads (500MB) | ⚠️ | MEDIUM | Plan C (chunked) |
| KV (1000 keys) | ✅ | None | No |
| KV (1000 keys) | ❌ | MEDIUM | Plan D (D1) |
| Supabase OAuth | ✅ | None | No |
| Supabase OAuth | ❌ | LOW | Plan E (manual) |

---

## Pivot Plans (Detailed)

### Plan A: Workers Cannot Run pg_dump
**Option A1:** Use Supabase Backup API
- Check if Supabase provides backup/restore endpoints
- Simpler, managed service
- May have limits on backup size/frequency

**Option A2:** VPS / Cloud Function for Backups
- Deploy simple Node.js service to run pg_dump
- Workers triggers this service via HTTP
- Upload to R2 from service
- More infrastructure, more control

**Option A3:** Supabase Edge Functions
- Write backup logic as Edge Function
- Supabase executes with more runtime
- Upload to R2 from function

**Decision Criteria:**
- A1 if Supabase API available and sufficient
- A2 if need full control and have VPS
- A3 if want to stay in Supabase ecosystem

---

### Plan B: better-auth Doesn't Work on Workers
**Option B1:** Lucia Auth
- Built for Cloudflare Workers
- KV-based sessions by default
- Active development, good docs

**Option B2:** Custom JWT + KV
- Simpler, full control
- Use Web Crypto API for signing
- Store sessions in KV

**Option B3:** Auth via Workers AI
- New service, may be overkill
- Built-in auth for Workers

**Decision Criteria:**
- B1 if want mature solution
- B2 if want minimal dependencies
- B3 if exploring new options

---

### Plan C: R2 Upload Limits
**Option C1:** Chunked Upload
- Split large files into 10MB chunks
- Recombine in R2 or on download
- More complex, but works

**Option C2:** Signed URLs with Direct Upload
- Generate signed R2 URL
- Upload from client (browser)
- Bypasses Workers for upload

**Decision Criteria:**
- C1 if need max compatibility
- C2 if better UX (progress bar)

---

### Plan D: KV Size Limits
**Option D1:** Cloudflare D1 (SQLite)
- Full SQL database, no size limits
- Can store all metadata + logs
- Slightly higher latency

**Option D2:** Hybrid KV + R2
- Recent logs in KV (fast access)
- Archived logs in R2 (infinite storage)
- More complex, but scalable

**Option D3:** Minimal KV + Search
- Store only essential fields in KV
- Backup log R2 location for full data
- Simplest, good enough for MVP

**Decision Criteria:**
- D1 if querying logs frequently
- D2 if cost-effective
- D3 if MVP-focused

---

### Plan E: Supabase OAuth Issues
**Option E1:** Manual Connection String Input
- User provides connection string directly
- No OAuth complexity
- User responsible for managing secrets

**Option E2:** Supabase REST API
- Use Supabase API for backup triggers
- May not support full pg_dump options
- Simpler auth flow

**Decision Criteria:**
- E1 if security > convenience
- E2 if want managed service

---

## Success Criteria (Sprint Complete)

**To mark sprint as SUCCESSFUL:**
- [ ] At least 3 of 5 critical tests pass
- [ ] Pivot plans documented for 2 that fail
- [ ] Workable architecture confirmed
- [ ] Turborepo initialized
- [ ] Basic UI theme implemented

**To mark sprint as NEEDS PIVOT:**
- ❌ Critical test (Workers + pg_dump) fails
- ❌ better-auth test fails
- Clear pivot strategy chosen
- Revised architecture documented

---

## Next Steps After Sprint

**If SUCCESSFUL:**
1. Update PLAN.md with confirmed tech choices
2. Update ROADMAP.md with adjusted timeline
3. Begin Phase 1: Foundation (per ROADMAP)
4. Start building MVP features

**If NEEDS PIVOT:**
1. Choose best pivot plan based on results
2. Document revised architecture
3. Update PLAN.md with new approach
4. Update ROADMAP.md with new tasks
5. Begin Phase 1 with revised stack

---

## Quick Start Command

```bash
# Clone the project
cd ~/clawd/postgres-backup-dashboard

# Start verification sprint
cat VERIFICATION-SPRINT.md

# Day 1 start
echo "Starting Day 1 tests..."
# Run Test 1, 2, etc.
```

---

## Daily Updates Template

**Day X Summary:**
- Tests completed: []
- Tests failed: []
- Decisions made: []
- Pivots identified: []
- Next steps: []

---

## Resources Needed

**For Testing:**
- [ ] Cloudflare account with Workers free tier
- [ ] Test PostgreSQL database (any free tier)
- [ ] Optional: Supabase project for OAuth test
- [ ] Node.js + npm installed

**For Building:**
- [ ] Wrangler CLI installed
- [ ] React + Vite ready
- [ ] Browser for manual testing

---

Let's verify before we build! 🔬
