# API Documentation

## Base URL

- Local Development: `http://localhost:8787`
- Production: `https://your-worker-name.workers.dev`

## Authentication

Currently using a simple session-based authentication. Include the session token in the `Authorization` header:

```
Authorization: Bearer <session-token>
```

## Response Format

All endpoints return JSON in the following format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-02T12:00:00Z"
}
```

---

## Statistics

Get overall dashboard statistics.

**Endpoint:** `GET /api/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBackups": 127,
    "successRate": "98.4",
    "storageUsed": "452.3",
    "retentionDays": 30,
    "totalDatabases": 6,
    "healthyDatabases": 5,
    "needsAttention": 1,
    "backingUp": 2
  }
}
```

---

## Databases

### List All Databases

Get a list of all configured databases.

**Endpoint:** `GET /api/databases`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "prod-main",
      "type": "direct",
      "connection": {
        "connectionString": "encrypted-string",
        "supabaseUrl": null,
        "supabaseKey": null
      },
      "settings": {
        "compression": "gzip",
        "retentionDays": 30,
        "customOptions": null
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "lastBackup": "2024-02-02T10:00:00Z",
      "healthStatus": "healthy"
    }
  ]
}
```

### Create Database

Add a new database connection.

**Endpoint:** `POST /api/databases`

**Request Body:**
```json
{
  "name": "prod-main",
  "type": "direct",
  "connection": {
    "connectionString": "postgresql://user:pass@host:port/dbname"
  },
  "settings": {
    "compression": "gzip",
    "retentionDays": 30
  }
}
```

For Supabase:
```json
{
  "name": "supabase-project",
  "type": "supabase",
  "connection": {
    "supabaseUrl": "https://xxx.supabase.co",
    "supabaseKey": "your-service-key"
  },
  "settings": {
    "compression": "gzip",
    "retentionDays": 30
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "prod-main",
    "type": "direct",
    "connection": { ... },
    "settings": { ... },
    "createdAt": "2024-02-02T12:00:00Z",
    "healthStatus": "unknown"
  }
}
```

### Test Database Connection

Test if a database connection is working.

**Endpoint:** `POST /api/databases/:id/test`

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "latency": 45
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "data": {
    "success": false,
    "error": "Connection timeout"
  }
}
```

---

## Backups

### Trigger Backup

Manually trigger a backup for a database.

**Endpoint:** `POST /api/databases/:id/backup`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "backup-uuid",
    "databaseId": "database-uuid",
    "status": "running",
    "startTime": "2024-02-02T12:00:00Z",
    "r2Key": "database-id/2024-02-02/backup.sql.gz"
  }
}
```

### Get Database Backups

List all backups for a specific database.

**Endpoint:** `GET /api/databases/:id/backups`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "backup-uuid",
      "databaseId": "database-uuid",
      "status": "success",
      "startTime": "2024-02-02T10:00:00Z",
      "endTime": "2024-02-02T10:00:12Z",
      "duration": 12000,
      "size": 45000000,
      "r2Key": "database-id/2024-02-02/backup.sql.gz",
      "error": null,
      "scheduleId": null
    }
  ]
}
```

### Get Backup Details

Get details of a specific backup.

**Endpoint:** `GET /api/backups/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "backup-uuid",
    "databaseId": "database-uuid",
    "status": "success",
    "startTime": "2024-02-02T10:00:00Z",
    "endTime": "2024-02-02T10:00:12Z",
    "duration": 12000,
    "size": 45000000,
    "r2Key": "database-id/2024-02-02/backup.sql.gz",
    "error": null,
    "scheduleId": "schedule-uuid"
  }
}
```

### Download Backup

Generate a signed URL to download a backup file.

**Endpoint:** `POST /api/backups/:id/download`

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://signed-url-for-download?expires=...",
    "expiresIn": 3600
  }
}
```

### Get Recent Backups

Get recent backup activity across all databases.

**Endpoint:** `GET /api/recent-backups`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "backup-uuid",
      "databaseId": "database-uuid",
      "status": "success",
      "startTime": "2024-02-02T10:00:00Z",
      "endTime": "2024-02-02T10:00:12Z",
      "duration": 12000,
      "size": 45000000,
      "r2Key": "database-id/2024-02-02/backup.sql.gz",
      "error": null,
      "scheduleId": null
    }
  ]
}
```

---

## Schedules

### List Schedules

Get all backup schedules (endpoint not yet implemented).

**Endpoint:** `GET /api/schedules`

### Create Schedule

Create a new backup schedule (endpoint not yet implemented).

**Endpoint:** `POST /api/schedules`

**Request Body:**
```json
{
  "databaseId": "database-uuid",
  "name": "Daily Backup",
  "cronExpression": "0 */2 * * *",
  "timezone": "UTC",
  "enabled": true,
  "notificationEnabled": true
}
```

### Update Schedule

Update an existing schedule (endpoint not yet implemented).

**Endpoint:** `PUT /api/schedules/:id`

### Delete Schedule

Delete a schedule (endpoint not yet implemented).

**Endpoint:** `DELETE /api/schedules/:id`

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

---

## WebSocket Events

For real-time backup progress, WebSocket events can be used (not yet implemented):

```javascript
const ws = new WebSocket('wss://api/backup-progress');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update progress bar
};
```

---

## Example Usage

### Using curl

```bash
# Get stats
curl http://localhost:8787/api/stats

# Create database
curl -X POST http://localhost:8787/api/databases \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-db",
    "type": "direct",
    "connection": {
      "connectionString": "postgresql://..."
    },
    "settings": {
      "compression": "gzip",
      "retentionDays": 30
    }
  }'

# Trigger backup
curl -X POST http://localhost:8787/api/databases/{id}/backup

# Download backup
curl -X POST http://localhost:8787/api/backups/{id}/download \
  -H "Authorization: Bearer {token}"
```

### Using JavaScript/fetch

```javascript
// Get stats
const response = await fetch('http://localhost:8787/api/stats');
const data = await response.json();
console.log(data);

// Create database
const response = await fetch('http://localhost:8787/api/databases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'test-db',
    type: 'direct',
    connection: {
      connectionString: 'postgresql://...'
    },
    settings: {
      compression: 'gzip',
      retentionDays: 30
    }
  })
});

// Trigger backup
const response = await fetch(`http://localhost:8787/api/databases/${id}/backup`, {
  method: 'POST'
});
```
