# UI Mockups - Dashboard-First (Linear-Inspired)

## Design Principles (Linear + Your Theme)

**Linear's aesthetic translated to your theme:**
- Crisp typography with generous spacing
- Subtle hover states (no heavy effects)
- Great use of negative space
- Status indicators with color coding
- Minimal borders, focus on content
- **Your twist:** 0px radius, jet black, electric green

---

## 🏠 Page 1: Dashboard (Overview)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ backup-dashboard                    🔍 [Search DBs...]   │   │
│ │                                                             │   │
│ │ ┌─────────────────────────────────────────────────────┐   │   │
│ │ │ prod     │ staging      │ analytics   │ [＋ New DB] │   │   │
│ │ └─────────────────────────────────────────────────────┘   │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ ALERT BANNER (only shows when there are issues)                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ● prod-main: Backup failed (2h ago) ─────────── [Dismiss] │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│ │ ALL          │ │ NEEDS        │ │ BACKING UP   │ │ COMPLETED   ││
│ │ 127          │ │ ATTENTION    │ │ 2            │ │ 125         ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ QUICK STATS                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│ │ 127 Backups │ │ 98.4%       │ │ 452.3 GB    │ │ 30-day      │  │
│ │             │ │ Success Rate│ │ Storage     │ │ Retention   │  │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ DATABASES OVERVIEW (click to deep dive)                          │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ Status │ Name            │ Last Backup      │ Next Run    │  │
│ ├────────┼────────────────┼──────────────────┼─────────────┤  │
│ ○ prod-main │ ● Healthy     │ ✓ 2h ago (45MB)   │ 2h          │  │
│ │           │                │                  │             │  │
│ ○ prod-analytics │ ● Healthy │ ✓ 6h ago (890MB)  │ 6h          │  │
│ │           │                │                  │             │  │
│ ● prod-reports │ ✗ Failed    │ ✗ 2h ago         │ —           │  │
│ │           │ [Retry] [View]  │                  │             │  │
│ ○ staging   │ ● Healthy      │ ✓ 1h ago (23MB)   │ 1h          │  │
│ ○ analytics │ ● Healthy      │ ✓ 4h ago (2.1GB)  │ 4h          │  │
│ ○ archive   │ ● Healthy      │ ✓ 12h ago (45GB)  │ 12h         │  │
│ ○ ... [scroll for 15 more databases]                             │  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Elements

**Status Indicators:**
```
○ Idle (gray, no scheduled run)
● Running (green, with spinner)
✓ Success (green, completed)
✗ Failed (red, needs attention)
⏸️ Paused (yellow)
```

**Alert Banner:**
- Only appears when there are failures
- Top of content, below header
- Shows most recent failed backup
- Dismiss button to acknowledge
- Click to view backup details

**Quick Filter Tabs:**
- `ALL` - all databases
- `NEEDS ATTENTION` - failed, overdue, unhealthy
- `BACKING UP` - currently in progress
- `COMPLETED` - successful (default view)

**Database Row Actions:**
- Click row → database detail page
- Hover shows: `[Backup] [Schedule] [Settings]`

---

## 📊 Page 2: Database Detail (Deep Dive)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ← Back          prod-main                     [×]          │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ STATUS CARD                                                  │  │
│ │ ● Healthy  •  Connected to postgresql://prod-db.xxxx.rds... │  │
│ │                                                             │  │
│ │ Last backup: ✓ 2h ago (45.2 MB, 12s)                        │  │
│ │ Next scheduled: 2h from now                                 │  │
│ │ Storage used: 1.2 GB (30-day retention)                     │  │
│ └─────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────┐  │
│ │ QUICK ACTIONS   │ │ BACKUP HISTORY                         │  │
│ │                 │ ┌─────────────────────────────────────┐  │  │
│ │ [Backup Now]    │ │ Date         Size    Status   Action│  │  │
│ │ [Edit Settings] │ ├─────────────────────────────────────┤  │  │
│ │ [View Schedules]│ │ 2h ago       45MB    ✓       ↓     │  │  │
│ │ [Test Connection]│ 6h ago       44MB    ✓       ↓     │  │  │
│ └─────────────────┘ │ 12h ago      43MB    ✓       ↓     │  │  │
│                     │ 18h ago      44MB    ✓       ↓     │  │  │
│                     │ [Load more...]                          │  │
│                     └─────────────────────────────────────┘  │  │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ SCHEDULES                                                      │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ Schedule       │ Frequency    │ Next Run        │ Status     │  │
│ ├────────────────┼─────────────┼─────────────────┼────────────┤  │
│ Daily Backup   │ Every 2h     │ 2h from now     │ ● Running  │  │
│ Weekly Full    │ Sun 3am      │ 5 days          │ ○ Idle     │  │
│ └────────────────┴─────────────┴─────────────────┴────────────┘  │
│                                                            [+ Add]│
└─────────────────────────────────────────────────────────────────┘
```

### Interactions

**Backup Button:**
- Click → triggers immediate backup
- Shows progress: `Backing up... [████████░░] 80%`
- On complete: `✓ Backup complete (45.2 MB, 12s)`

**Backup History Row:**
- `↓` → download backup file
- Click row → backup detail modal

**Schedule Row:**
- Hover shows: `[Edit] [Disable] [Run Now]`
- Status dot shows current state

---

## 📁 Page 3: All Backups (Grid View)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ All Backups                             🔍 [Search...]    │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ FILTERS                                                         │
│ Database: [prod-main ▼]    Status: [All ▼]    Date: [Last 30d] │
├─────────────────────────────────────────────────────────────────┤
│ BACKUP GRID                                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ prod-main       │ │ prod-analytics   │ │ staging         │    │
│ │                 │ │                 │ │                 │    │
│ │ ✓ 2h ago        │ │ ✓ 6h ago        │ │ ✓ 1h ago        │    │
│ │ 45.2 MB         │ │ 890 MB          │ │ 23 MB           │    │
│ │ 12s duration    │ │ 2m 45s duration │ │ 8s duration     │    │
│ │                 │ │                 │ │                 │    │
│ │ [Download] [→]  │ │ [Download] [→]  │ │ [Download] [→]  │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ analytics       │ │ prod-reports    │ │ archive         │    │
│ │                 │ │                 │ │                 │    │
│ │ ✓ 4h ago        │ │ ✗ 2h ago        │ │ ✓ 12h ago       │    │
│ │ 2.1 GB          │ │ — (failed)      │ │ 45 GB           │    │
│ │ 5m 12s duration │ │ —               │ │ 18m 30s duration│    │
│ │                 │ │                 │ │                 │    │
│ │ [Download] [→]  │ │ [Retry] [View]  │ │ [Download] [→]  │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│ [Load more backups...]                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Card States

**Success Card:**
```
prod-main
─────────────
✓ 2h ago
45.2 MB
12s duration

[Download] [→]
```

**Failed Card:**
```
prod-reports
─────────────
✗ 2h ago
Connection timeout

[Retry] [View] [→]
```

**Running Card:**
```
prod-main
─────────────
● Backing up...
████████░░ 80%

[Cancel]
```

---

## ⏰ Page 4: Schedules (All Databases)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Schedules                               [+ New Schedule] │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ SCHEDULE LIST                                                   │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ prod-main  Daily Backup        ● Enabled  Next: 2h        │  │
│ │            Every 2 hours                  [Edit] [Disable] │  │
│ ├─────────────────────────────────────────────────────────────┤  │
│ │ prod-main  Weekly Full          ○ Enabled  Next: Sun 3am  │  │
│ │            Every Sunday 3am              [Edit] [Disable] │  │
│ ├─────────────────────────────────────────────────────────────┤  │
│ │ staging    Hourly              ● Enabled  Next: 1h        │  │
│ │            Every hour                    [Edit] [Disable] │  │
│ ├─────────────────────────────────────────────────────────────┤  │
│ │ analytics  Daily                ● Enabled  Next: 4h        │  │
│ │            Every 4 hours                  [Edit] [Disable] │  │
│ └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Schedule Detail Modal
```
┌─────────────────────────────────────┐
│ Edit Schedule              [×]       │
├─────────────────────────────────────┤
│ Database: [prod-main ▼]            │
│ Name: [Daily Backup               ] │
│                                     │
│ Frequency:                          │
│ [Every] [2] [hours ▼]               │
│ ○ Custom cron: [0 */2 * * *       ] │
│                                     │
│ Timezone: [UTC ▼]                  │
│                                     │
│ Notification: [✓] Email on failure  │
│                                     │
│ [Cancel]              [Save]       │
└─────────────────────────────────────┘
```

---

## ⚙️ Page 5: Settings

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Settings                                                   │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ SECTIONS                                                        │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ GENERAL                                                       │  │
│ │ ├─────────────────────────────────────────────────────────┤  │
│ │ │ Default retention: [30 days ▼]                         │  │
│ │ │ Default compression: [gzip ▼]                           │  │
│ │ │ Timezone: [UTC ▼]                                       │  │
│ │ └─────────────────────────────────────────────────────────┘  │  │
│ │                                                               │  │
│ │ NOTIFICATIONS                                                 │  │
│ │ ├─────────────────────────────────────────────────────────┤  │
│ │ │ Email: [admin@example.com                 ] [Send Test] │  │
│ │ │ Notify on: [✓] Backup failure [ ] Backup success       │  │
│ │ │            [✓] Storage quota warning                    │  │
│ │ └─────────────────────────────────────────────────────────┘  │  │
│ │                                                               │  │
│ │ STORAGE                                                       │  │
│ │ ├─────────────────────────────────────────────────────────┤  │
│ │ │ Bucket: postgres-backups                                 │  │
│ │ │ Region: us-east-1                                        │  │
│ │ │ Used: 452.3 GB / 1 TB                                     │  │
│ │ └─────────────────────────────────────────────────────────┘  │  │
│ │                                                               │  │
│ │ DANGER ZONE                                                  │  │
│ │ ├─────────────────────────────────────────────────────────┤  │
│ │ │ [Delete all backups] (irreversible)                      │  │
│ │ │ [Purge failed backups]                                    │  │
│ │ └─────────────────────────────────────────────────────────┘  │  │
│ └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Library

### Status Badges
```
✓ Success → [■ Success] (green bg, white text, 0 radius)
✗ Failed  → [■ Failed]  (red bg, white text, 0 radius)
● Running → [■ Running] (green bg, pulsing)
○ Idle    → [■ Idle]    (gray bg, white text)
```

### Buttons
```
[Backup Now]      → primary (black bg, green border, green text)
[Cancel]          → secondary (gray bg, white text)
[Download]        → text-only (green, no bg)
[Edit] [Disable]  → small buttons on hover
```

### Inputs
```
┌─────────────────────────────────┐
│ postgresql://prod-db...         │ ← 1px solid #1a1a1a
└─────────────────────────────────┘
  Focus: green border, slight glow
```

### Tables
```
┌──────────────┬─────────────┬─────────┬──────────┐
│ Header       │ Header      │ Header  │ Header   │
├──────────────┼─────────────┼─────────┼──────────┤
│ Row data     │ Row data    │ Row     │ Row      │
│              │             │ data    │ data     │
├──────────────┼─────────────┼─────────┼──────────┤
│ Row data     │ Row data    │ Row     │ Row      │
└──────────────┴─────────────┴─────────┴──────────┘

- 1px borders everywhere
- No rounded corners
- Subtle row hover (bg: #0f0f0f)
- Status column left-aligned
```

### Cards
```
┌─────────────────────────────────┐
│                                 │
│ Card Content                    │
│                                 │
└─────────────────────────────────┘
- 1px border #1a1a1a
- No shadows
- No radius
- Sharp edges
```

---

## 📱 Responsive Design

### Mobile (< 768px)
- Dashboard: Stats stack vertically
- Database table → card view
- Navigation → bottom tab bar

### Tablet (768px - 1024px)
- Dashboard: 2-column stats
- Database table → horizontal scroll
- Keep sidebar collapsed

### Desktop (> 1024px)
- Full dashboard layout
- All features visible

---

## 🎨 Color Palette (Final)

```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--bg-tertiary: #0f0f0f;
--border: #1a1a1a;
--border-hover: #2a2a2a;
--text-primary: #e5e5e5;
--text-secondary: #a3a3a3;
--accent: #00ff00;
--accent-dim: rgba(0, 255, 0, 0.1);
--success: #22c55e;
--error: #ef4444;
--warning: #eab308;
```

---

## ⚡ Animations (Subtle, Linear-style)

- Hover: bg change (no transform, no scale)
- Loading: simple spinner, not skeleton screens
- Progress bars: smooth, no bounce
- Toast notifications: slide in from top-right
- Page transitions: simple fade (500ms)

---

## 🚀 Next Steps

1. Initialize Turborepo with React + Vite
2. Set up Tailwind with custom theme
3. Build base components (Button, Card, Table, Badge)
4. Implement router structure
5. Build Dashboard page first
6. Then detail pages

Ready to start building? 🦞
