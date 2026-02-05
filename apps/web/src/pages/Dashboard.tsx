import React, { useState } from 'react';
import { QuickStats } from '@postgres-backup-dashboard/ui';
import { AlertBanner } from '@postgres-backup-dashboard/ui';
import { Table } from '@postgres-backup-dashboard/ui';
import { DatabaseRow } from '@postgres-backup-dashboard/ui';
import { Badge } from '@postgres-backup-dashboard/ui';
import { Button } from '@postgres-backup-dashboard/ui';
import { DatabaseConfig, Backup, DashboardStats } from '@postgres-backup-dashboard/types';

export default function Dashboard() {
  const [filter, setFilter] = useState<'all' | 'needs-attention' | 'backing-up' | 'completed'>('all');
  const [showAlert, setShowAlert] = useState(true);
  
  // Mock data - will be replaced with API calls
  const stats: DashboardStats = {
    totalBackups: 127,
    successRate: 98.4,
    storageUsed: 452.3,
    retentionDays: 30,
    totalDatabases: 6,
    healthyDatabases: 5,
    needsAttention: 1,
    backingUp: 2,
  };
  
  const databases: (DatabaseConfig & { latestBackup?: Backup; nextRun?: string })[] = [
    {
      id: '1',
      name: 'prod-main',
      type: 'direct',
      connection: { connectionString: 'postgresql://...' },
      settings: { compression: 'gzip', retentionDays: 30 },
      createdAt: '2024-01-01',
      lastBackup: '2024-02-02T10:00:00Z',
      healthStatus: 'healthy',
      latestBackup: {
        id: 'b1',
        databaseId: '1',
        status: 'success',
        startTime: '2024-02-02T10:00:00Z',
        endTime: '2024-02-02T10:00:12Z',
        duration: 12000,
        size: 45000000,
        r2Key: 'prod-main/2024-02-02/backup.sql.gz',
      },
      nextRun: '2024-02-02T12:00:00Z',
    },
    {
      id: '2',
      name: 'prod-analytics',
      type: 'supabase',
      connection: { supabaseUrl: 'https://xxx.supabase.co', supabaseKey: '...' },
      settings: { compression: 'gzip', retentionDays: 30 },
      createdAt: '2024-01-01',
      lastBackup: '2024-02-02T04:00:00Z',
      healthStatus: 'healthy',
      latestBackup: {
        id: 'b2',
        databaseId: '2',
        status: 'success',
        startTime: '2024-02-02T04:00:00Z',
        endTime: '2024-02-02T04:02:45Z',
        duration: 165000,
        size: 890000000,
        r2Key: 'analytics/2024-02-02/backup.sql.gz',
      },
      nextRun: '2024-02-02T10:00:00Z',
    },
    {
      id: '3',
      name: 'prod-reports',
      type: 'direct',
      connection: { connectionString: 'postgresql://...' },
      settings: { compression: 'gzip', retentionDays: 30 },
      createdAt: '2024-01-01',
      lastBackup: '2024-02-02T08:00:00Z',
      healthStatus: 'unhealthy',
      latestBackup: {
        id: 'b3',
        databaseId: '3',
        status: 'failed',
        startTime: '2024-02-02T08:00:00Z',
        error: 'Connection timeout',
        r2Key: '',
      },
    },
    {
      id: '4',
      name: 'staging',
      type: 'direct',
      connection: { connectionString: 'postgresql://...' },
      settings: { compression: 'gzip', retentionDays: 30 },
      createdAt: '2024-01-01',
      lastBackup: '2024-02-02T11:00:00Z',
      healthStatus: 'healthy',
      latestBackup: {
        id: 'b4',
        databaseId: '4',
        status: 'success',
        startTime: '2024-02-02T11:00:00Z',
        endTime: '2024-02-02T11:00:08Z',
        duration: 8000,
        size: 23000000,
        r2Key: 'staging/2024-02-02/backup.sql.gz',
      },
      nextRun: '2024-02-02T12:00:00Z',
    },
  ];
  
  const statCards = [
    { label: 'Total Backups', value: stats.totalBackups },
    { label: 'Success Rate', value: `${stats.successRate}%` },
    { label: 'Storage', value: `${stats.storageUsed} GB`, subtitle: '30-day retention' },
    { label: 'Retention', value: `${stats.retentionDays} days` },
  ];
  
  const filterCards = [
    { id: 'all', label: 'ALL', count: stats.totalBackups },
    { id: 'needs-attention', label: 'NEEDS ATTENTION', count: stats.needsAttention },
    { id: 'backing-up', label: 'BACKING UP', count: stats.backingUp },
    { id: 'completed', label: 'COMPLETED', count: stats.totalBackups - stats.needsAttention - stats.backingUp },
  ];
  
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b-1 border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text-primary">
              backup-dashboard
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search databases..."
                className="input w-64"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Database Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="neutral">prod</Badge>
          <Badge variant="neutral">staging</Badge>
          <Badge variant="neutral">analytics</Badge>
          <Button variant="primary" size="sm">
            ＋ New DB
          </Button>
        </div>
        
        {/* Alert Banner */}
        {showAlert && (
          <div className="mb-6">
            <AlertBanner
              databaseName="prod-reports"
              message="Backup failed (2h ago)"
              onDismiss={() => setShowAlert(false)}
            />
          </div>
        )}
        
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b-1 border-border pb-4">
          {filterCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setFilter(card.id as any)}
              className={`px-4 py-2 text-sm transition-colors ${
                filter === card.id
                  ? 'text-accent border-b-1 border-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {card.label}
              <span className="ml-2 text-text-muted">{card.count}</span>
            </button>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats stats={statCards} />
        </div>
        
        {/* Database Table */}
        <div className="card">
          <Table
            headers={['Status', 'Name', 'Last Backup', 'Next Run', 'Actions']}
            rows={databases.map((db) => [
              <DatabaseRow
                key={db.id}
                database={db}
                latestBackup={db.latestBackup}
                nextRun={db.nextRun}
                onBackup={(id) => console.log('Backup', id)}
                onSchedule={(id) => console.log('Schedule', id)}
                onSettings={(id) => console.log('Settings', id)}
              />,
            ])}
          />
        </div>
      </main>
    </div>
  );
}
