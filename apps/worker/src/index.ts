import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';

type Bindings = {
  BACKUP_LOGS: KVNamespace;
  BACKUP_BUCKET: R2Bucket;
  BETTER_AUTH_SECRET: string;
  DATABASE_ENCRYPTION_KEY: string;
  ENVIRONMENT: string;
};

type Variables = {
  userId?: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://your-production-domain.com'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/stats', async (c) => {
  try {
    // Get all backup logs
    const list = await c.env.BACKUP_LOGS.list({ prefix: 'backup:' });
    
    let totalBackups = 0;
    let successCount = 0;
    let totalStorage = 0;
    
    for (const key of list.keys) {
      const value = await c.env.BACKUP_LOGS.get(key.name);
      if (value) {
        const backup = JSON.parse(value);
        totalBackups++;
        if (backup.status === 'success') successCount++;
        totalStorage += backup.size || 0;
      }
    }
    
    const successRate = totalBackups > 0 ? (successCount / totalBackups) * 100 : 0;
    const storageGB = totalStorage / (1024 * 1024 * 1024);
    
    return c.json({
      totalBackups,
      successRate: successRate.toFixed(1),
      storageUsed: storageGB.toFixed(1),
      retentionDays: 30,
      totalDatabases: 0,
      healthyDatabases: 0,
      needsAttention: 0,
      backingUp: 0,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Get all databases
app.get('/api/databases', async (c) => {
  try {
    const list = await c.env.BACKUP_LOGS.list({ prefix: 'database:' });
    const databases = [];
    
    for (const key of list.keys) {
      const value = await c.env.BACKUP_LOGS.get(key.name);
      if (value) {
        databases.push(JSON.parse(value));
      }
    }
    
    return c.json({ success: true, data: databases });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch databases' }, 500);
  }
});

// Create database
app.post('/api/databases', async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    
    const database = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      healthStatus: 'unknown',
    };
    
    await c.env.BACKUP_LOGS.put(`database:${id}`, JSON.stringify(database));
    
    return c.json({ success: true, data: database });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create database' }, 500);
  }
});

// Test database connection
app.post('/api/databases/:id/test', async (c) => {
  const id = c.req.param('id');
  
  try {
    // Get database config
    const value = await c.env.BACKUP_LOGS.get(`database:${id}`);
    if (!value) {
      return c.json({ success: false, error: 'Database not found' }, 404);
    }
    
    const database = JSON.parse(value);
    
    // Test connection (mock for now - in production, actually connect)
    const startTime = Date.now();
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    const latency = Date.now() - startTime;
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      // Update health status
      database.healthStatus = 'healthy';
      await c.env.BACKUP_LOGS.put(`database:${id}`, JSON.stringify(database));
      
      return c.json({
        success: true,
        data: {
          success: true,
          latency,
        },
      });
    } else {
      database.healthStatus = 'unhealthy';
      await c.env.BACKUP_LOGS.put(`database:${id}`, JSON.stringify(database));
      
      return c.json({
        success: false,
        data: {
          success: false,
          error: 'Connection failed',
        },
      });
    }
  } catch (error) {
    return c.json({ success: false, error: 'Failed to test connection' }, 500);
  }
});

// Trigger backup
app.post('/api/databases/:id/backup', async (c) => {
  const id = c.req.param('id');
  
  try {
    // Get database config
    const value = await c.env.BACKUP_LOGS.get(`database:${id}`);
    if (!value) {
      return c.json({ success: false, error: 'Database not found' }, 404);
    }
    
    const database = JSON.parse(value);
    const backupId = crypto.randomUUID();
    const startTime = new Date().toISOString();
    
    // Create running backup record
    const backup = {
      id: backupId,
      databaseId: id,
      status: 'running',
      startTime,
      r2Key: `${id}/${startTime.replace(/[:.]/g, '-')}/backup.sql.gz`,
    };
    
    await c.env.BACKUP_LOGS.put(`backup:${backupId}`, JSON.stringify(backup));
    
    // In production, this would trigger the actual backup
    // For now, we'll simulate a successful backup
    setTimeout(async () => {
      const size = Math.floor(Math.random() * 1000000000);
      const duration = Math.floor(Math.random() * 60000);
      
      backup.status = 'success';
      backup.endTime = new Date().toISOString();
      backup.duration = duration;
      backup.size = size;
      
      await c.env.BACKUP_LOGS.put(`backup:${backupId}`, JSON.stringify(backup));
      
      // Update database's last backup
      database.lastBackup = startTime;
      database.healthStatus = 'healthy';
      await c.env.BACKUP_LOGS.put(`database:${id}`, JSON.stringify(database));
    }, 2000);
    
    return c.json({ success: true, data: backup });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to trigger backup' }, 500);
  }
});

// Get backups for a database
app.get('/api/databases/:id/backups', async (c) => {
  const id = c.req.param('id');
  
  try {
    const list = await c.env.BACKUP_LOGS.list({ prefix: 'backup:' });
    const backups = [];
    
    for (const key of list.keys) {
      const value = await c.env.BACKUP_LOGS.get(key.name);
      if (value) {
        const backup = JSON.parse(value);
        if (backup.databaseId === id) {
          backups.push(backup);
        }
      }
    }
    
    // Sort by start time descending
    backups.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    return c.json({ success: true, data: backups });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch backups' }, 500);
  }
});

// Get backup details
app.get('/api/backups/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const value = await c.env.BACKUP_LOGS.get(`backup:${id}`);
    if (!value) {
      return c.json({ success: false, error: 'Backup not found' }, 404);
    }
    
    return c.json({ success: true, data: JSON.parse(value) });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch backup' }, 500);
  }
});

// Download backup
app.post('/api/backups/:id/download', async (c) => {
  const id = c.req.param('id');
  
  try {
    const value = await c.env.BACKUP_LOGS.get(`backup:${id}`);
    if (!value) {
      return c.json({ success: false, error: 'Backup not found' }, 404);
    }
    
    const backup = JSON.parse(value);
    
    // Generate signed URL for R2 download
    const url = await c.env.BACKUP_BUCKET.signedUrl(backup.r2Key, {
      expiresIn: 3600, // 1 hour
    });
    
    return c.json({ success: true, data: { downloadUrl: url } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to generate download URL' }, 500);
  }
});

// Get recent backups
app.get('/api/recent-backups', async (c) => {
  try {
    const list = await c.env.BACKUP_LOGS.list({ prefix: 'backup:', limit: 20 });
    const backups = [];
    
    for (const key of list.keys) {
      const value = await c.env.BACKUP_LOGS.get(key.name);
      if (value) {
        backups.push(JSON.parse(value));
      }
    }
    
    // Sort by start time descending
    backups.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    return c.json({ success: true, data: backups });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch recent backups' }, 500);
  }
});

export default app;
