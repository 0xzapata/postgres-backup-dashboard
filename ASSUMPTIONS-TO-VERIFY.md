# Assumptions & Verification Points

## 🎯 Goal
Identify assumptions in the current plan that need verification before implementation starts.

---

## 📋 High-Level Assumptions to Verify

### 1. Authentication & Security
**Assumption:** better-auth supports username/password only
**What:** We're assuming better-auth can handle simple credential auth without OAuth/social providers
**Verify:**
- [ ] Confirm better-auth supports username/password flow
- [ ] Check if it works with Cloudflare Workers
- [ ] Verify session management with Cloudflare KV

**Risk:** If better-auth requires full OAuth/social stack, may need to reconsider

---

### 2. Database Connection Types
**Assumption:** Supabase has a simple connection method
**What:** Assuming Supabase OAuth provides direct database access credentials
**Verify:**
- [ ] Check Supabase API for database connection strings
- [ ] Confirm if OAuth tokens translate to Postgres credentials
- [ ] Verify connection string format needed

**Assumption:** Direct PostgreSQL accepts standard connection strings
**What:** Connection string from user will work with neon/postgres client
**Verify:**
- [ ] Test neon/postgres with connection strings
- [ ] Confirm SSL/TLS options work
- [ ] Verify connection pooling configuration

---

### 3. Cloudflare R2 Integration
**Assumption:** pg_dump output can be streamed directly to R2
**What:** We can pipe pg_dump directly to R2 without intermediate files
**Verify:**
- [ ] Check Cloudflare Workers R2 upload API for streaming
- [ ] Confirm pg_dump can output to stdout/pipe
- [ ] Test large file uploads (500MB+)

**Assumption:** R2 signed URLs work for downloads
**What:** Can generate time-limited download URLs
**Verify:**
- [ ] Test signed URL generation
- [ ] Verify expiration times work correctly
- [ ] Confirm CORS headers are handled

---

### 4. Scheduling Architecture
**Assumption:** Cloudflare Cron Triggers can invoke Workers
**What:** Worker cron jobs can trigger backup functions
**Verify:**
- [ ] Test Cloudflare Cron → Worker invocation
- [ ] Verify Worker can execute long-running tasks (>5 min)
- [ ] Check if Workers have timeout limits for large backups

**Assumption:** Multiple schedules per database
**What:** Can have daily + weekly schedules for same DB
**Verify:**
- [ ] Confirm KV can store multiple schedule entries
- [ ] Test cron expression parsing works
- [ ] Verify schedule conflict handling

---

### 5. pg_dump Functionality
**Assumption:** pg_dump available in Cloudflare Workers
**What:** Can execute pg_dump commands from Workers
**Verify:**
- [ ] Check if Workers can spawn sub-processes
- [ ] Verify if postgres client works in Workers runtime
- [ ] Test memory limits for large dumps

**Risk:** If Workers can't run pg_dump, may need different approach:
- Use Supabase's backup API (if available)
- Run pg_dump from separate service (VPS/Functions)
- Consider Cloudflare Workers AI for code generation

---

### 6. KV Storage Limits
**Assumption:** KV can store all backup logs
**What:** Unlimited storage for backup metadata
**Verify:**
- [ ] Check KV value size limits (typically 1MB per key)
- [ ] Verify query performance for large datasets
- [ ] Confirm KV read/write rate limits

**Risk:** If KV has size limits:
- [ ] Use compression for large values
- [ ] Store minimal metadata in KV, full details in D1
- [ ] Implement pagination for log queries

---

### 7. Frontend Build Target
**Assumption:** Cloudflare Pages + Workers separate deployment
**What:** Static frontend on Pages, API on Workers
**Verify:**
- [ ] Confirm CORS setup between Pages and Workers
- [ ] Test API calls from Pages domain
- [ ] Verify environment variable access in Pages

**Risk:** If API calls fail from Pages:
- [ ] May need Workers to serve frontend too
- [ ] Configure custom domain for both services

---

### 8. better-auth with Cloudflare Workers
**Assumption:** better-auth works with Cloudflare Workers
**What:** Session storage in Workers KV
**Verify:**
- [ ] Check better-auth Workers compatibility
- [ ] Confirm session encryption works
- [ ] Test rate limiting in Workers environment

**Risk:** If better-auth doesn't support Workers:
- [ ] May need alternative auth solution
- [ ] Consider Lucia Auth or custom JWT implementation

---

### 9. UI Design System (Linear-Inspired)
**Assumption:** Can implement Linear's design with our constraints
**What:** Jet black + green accent + 0px border-radius is achievable
**Verify:**
- [ ] Test Tailwind configuration for custom theme
- [ ] Confirm component library works without rounded corners
- [ ] Verify responsive design works with sharp edges

**Risk:** Linear uses subtle gradients, shadows that may clash:
- [ ] Decide on shadow usage (minimal vs none)
- [ ] Test animation performance
- [ ] Confirm accessible color contrast ratios

---

### 10. Backup Restoration
**Assumption:** Can pipe SQL directly to Postgres
**What:** psql can restore from stdin
**Verify:**
- [ ] Test psql restore from R2 stream
- [ ] Verify restore progress tracking
- [ ] Confirm large database restore handling

**Risk:** If streaming restore fails:
- [ ] Download to disk first then restore
- [ ] Implement chunked restore for large DBs
- [ ] Add restore timeout handling

---

## 🔴 Critical Path Dependencies

### Showstoppers (Must Verify Before Starting)

1. **Cloudflare Workers can execute pg_dump**
   - If NO → Need VPS/supabase-backup-API approach
   - Impact: Major architecture change

2. **better-auth works with Workers**
   - If NO → Need alternative auth solution
   - Impact: Auth system rewrite

3. **Supabase provides direct DB credentials**
   - If NO → OAuth approach different
   - Impact: Connection complexity increases

4. **KV can handle log scale**
   - If NO → Need D1 or separate storage
   - Impact: Cost and complexity increases

---

## 🟡 Medium-Risk Assumptions

### Worth Quick Testing Before Full Build

1. **R2 upload performance** → Test with 500MB file
2. **KV query performance** → Test with 1000+ entries
3. **pg_dump availability in Workers** → Run quick prototype
4. **Restore functionality** → Test with sample DB
5. **Cron reliability** → Test schedule triggers

---

## 🟢 Low-Risk Assumptions

### Can Address During Development

1. **UI components implementable** → Build as we go
2. **CORS between services** → Configure in deployment
3. **Tailwind theme achievable** → Try in first prototype
4. **Email notification integration** → Set up after core works
5. **Retention policies** → Implement with cron job

---

## 📊 Verification Checklist (Before Phase 1 Start)

- [ ] **Run Cloudflare Workers prototype** → Test pg_dump capability
- [ ] **Test better-auth on Workers** → Verify session management
- [ ] **Prototype Supabase connection** → Confirm credential flow
- [ ] **Test R2 upload/download** → Verify file size limits
- [ ] **Validate KV performance** → Test with 100 backup logs
- [ ] **Confirm UI theme implementation** → Build quick prototype

---

## 💡 Alternative Approaches (If Assumptions Fail)

### If Workers can't run pg_dump:
**Option A:** Use Supabase's built-in backup API (if available)
**Option B:** Spawn short-lived compute instance for backups
**Option C:** Use Supabase Edge Functions with backup logic

### If better-auth doesn't support Workers:
**Option A:** Use Lucia Auth (Workers-compatible)
**Option B:** Custom JWT auth with Workers KV
**Option C:** Auth via separate Workers AI service

### If KV has size limits:
**Option A:** Use Cloudflare D1 for metadata storage
**Option B:** Compress logs before KV storage
**Option C:** Store recent logs in KV, archive older to R2

---

## 🎯 Recommendation: Quick Verification Sprint

**1 Week** → Test critical assumptions before full build:

1. Deploy minimal Worker with pg_dump test
2. Test better-auth session storage
3. Validate R2 upload/download with large files
4. Prototype Supabase connection flow
5. Build simple UI to confirm theme works

**Pass/Fail Decision:**
- ✅ All pass → Proceed with full implementation
- ❌ Critical fails → Pivot architecture before building

---

## Questions for User

1. **Do you have access to:**
   - Supabase project to test connection?
   - Cloudflare account with Workers/R2 enabled?
   - Existing Postgres database for testing?

2. **Preferences for critical failures:**
   - Use VPS for backup execution if Workers can't?
   - Switch auth solution if better-auth fails?
   - Accept KV limitations and use D1?

3. **Timeline flexibility:**
   - Can we spend 3-5 days on verification?
   - Or should we build while verifying (parallel approach)?

---

## Next Steps

Once assumptions verified:
1. Update PLAN.md with confirmed architecture
2. Update ROADMAP.md with verified dependencies
3. Begin Phase 1: Foundation

If critical assumption fails:
1. Document pivot strategy
2. Update architecture diagrams
3. Revise roadmap with new approach
