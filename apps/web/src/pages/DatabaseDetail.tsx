import React from 'react';
import { Card } from '@postgres-backup-dashboard/ui';
import { Button } from '@postgres-backup-dashboard/ui';
import { Badge } from '@postgres-backup-dashboard/ui';
import { StatusIndicator } from '@postgres-backup-dashboard/ui';
import { Table } from '@postgres-backup-dashboard/ui';
import { DatabaseConfig, Backup, Schedule } from '@postgres-backup-dashboard/types';

interface DatabaseDetailProps {
  database: DatabaseConfig;
  backups: Backup[];
  schedules: Schedule[];
  onBack: () => void;
  onBackup: () => void;
}

export default function DatabaseDetail({ database, backups, schedules, onBack, onBackup }: DatabaseDetailProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b-1 border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-text-secondary hover:text-text-primary flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold text-text-primary">{database.name}</h1>
            <button className="text-text-secondary hover:text-text-primary">×</button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Status Card */}
        <Card className="mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusIndicator status={database.healthStatus === 'healthy' ? 'idle' : 'failed'} showText />
              <span className="text-text-secondary">
                Connected to {database.type === 'supabase' ? 'Supabase' : 'PostgreSQL'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Last backup:</span>
                <span className="text-text-primary">
                  {database.lastBackup ? '✓ 2h ago (45.2 MB, 12s)' : 'No backups yet'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next scheduled:</span>
                <span className="text-text-primary">2h from now</span>
              </div>
              <div className="flex justify-between">
                <span>Storage used:</span>
                <span className="text-text-primary">1.2 GB (30-day retention)</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <Card className="mb-8 p-4">
              <h3 className="text-text-primary font-semibold mb-4">QUICK ACTIONS</h3>
              <div className="space-y-2">
                <Button variant="primary" className="w-full" onClick={onBackup}>
                  Backup Now
                </Button>
                <Button variant="secondary" className="w-full">
                  Edit Settings
                </Button>
                <Button variant="secondary" className="w-full">
                  View Schedules
                </Button>
                <Button variant="secondary" className="w-full">
                  Test Connection
                </Button>
              </div>
            </Card>
            
            {/* Backup History */}
            <Card>
              <h3 className="text-text-primary font-semibold mb-4">BACKUP HISTORY</h3>
              <Table
                headers={['Date', 'Size', 'Status', 'Action']}
                rows={backups.slice(0, 10).map((backup) => [
                  <span key="date" className="text-text-primary text-sm">
                    {new Date(backup.startTime).toLocaleString()}
                  </span>,
                  <span key="size" className="text-text-secondary text-sm">
                    {backup.size ? `${(backup.size / (1024 * 1024)).toFixed(1)} MB` : '—'}
                  </span>,
                  <Badge key="status" variant={backup.status === 'success' ? 'success' : 'error'}>
                    {backup.status}
                  </Badge>,
                  <button key="action" className="text-accent hover:text-accent/80 text-sm">
                    ↓
                  </button>,
                ])}
              />
            </Card>
          </div>
          
          {/* Right Column - Schedules */}
          <div>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-primary font-semibold">SCHEDULES</h3>
                <button className="text-accent hover:text-accent/80 text-sm">＋ Add</button>
              </div>
              
              {schedules.length === 0 ? (
                <p className="text-text-secondary text-sm">No schedules configured</p>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="p-3 bg-bg-tertiary border-1 border-border">
                      <div className="text-text-primary font-medium mb-1">{schedule.name}</div>
                      <div className="text-text-secondary text-sm mb-2">{schedule.cronExpression}</div>
                      <div className="flex items-center justify-between">
                        <StatusIndicator 
                          status={schedule.enabled ? 'running' : 'paused'} 
                          showText 
                          size="sm"
                        />
                        <span className="text-text-muted text-xs">
                          Next: {new Date(schedule.nextRun).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
