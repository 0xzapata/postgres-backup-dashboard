// Database Configuration Types
export interface DatabaseConfig {
  id: string;
  name: string;
  type: 'supabase' | 'direct';
  connection: {
    connectionString?: string; // encrypted
    supabaseUrl?: string;
    supabaseKey?: string; // encrypted
  };
  settings: {
    compression: 'gzip' | 'zstd';
    retentionDays: number;
    customOptions?: string;
  };
  createdAt: string;
  lastBackup?: string;
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
}

export interface ConnectionTestResult {
  success: boolean;
  latency?: number;
  error?: string;
}

// Backup Types
export interface Backup {
  id: string;
  databaseId: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  duration?: number;
  size?: number;
  r2Key: string;
  error?: string;
  scheduleId?: string;
}

export interface BackupStats {
  total: number;
  successRate: number;
  storageUsed: number;
  retentionDays: number;
}

// Schedule Types
export interface Schedule {
  id: string;
  databaseId: string;
  name: string;
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  nextRun: string;
  lastRun?: string;
  notificationEnabled: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalBackups: number;
  successRate: number;
  storageUsed: number;
  retentionDays: number;
  totalDatabases: number;
  healthyDatabases: number;
  needsAttention: number;
  backingUp: number;
}

// Recent Activity
export interface RecentActivity {
  id: string;
  type: 'backup' | 'restore' | 'schedule' | 'error';
  databaseId: string;
  databaseName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  details?: string;
}

// Settings Types
export interface Settings {
  defaultRetentionDays: number;
  defaultCompression: 'gzip' | 'zstd';
  timezone: string;
  notifications: {
    email: string;
    notifyOnFailure: boolean;
    notifyOnSuccess: boolean;
    notifyOnQuota: boolean;
  };
  storage: {
    bucket: string;
    region: string;
    quota: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}
