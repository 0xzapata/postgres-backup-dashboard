import React from 'react';
import { StatusIndicator } from './StatusIndicator';
import { Button } from './Button';
import { DatabaseConfig, Backup } from '@postgres-backup-dashboard/types';

export interface DatabaseRowProps {
  database: DatabaseConfig;
  latestBackup?: Backup;
  nextRun?: string;
  onBackup: (id: string) => void;
  onSchedule: (id: string) => void;
  onSettings: (id: string) => void;
}

export function DatabaseRow({ 
  database, 
  latestBackup, 
  nextRun,
  onBackup, 
  onSchedule, 
  onSettings 
}: DatabaseRowProps) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };
  
  const formatNextRun = (timestamp?: string) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 0) return 'Overdue';
    if (diffHrs < 1) return 'Due now';
    if (diffHrs < 24) return `In ${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    return `In ${diffDays}d`;
  };
  
  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(mb * 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };
  
  return (
    <tr className="table-tr group">
      <td className="table-td">
        <div className="flex items-center gap-3">
          <StatusIndicator status={database.healthStatus === 'healthy' ? 'idle' : 'failed'} />
          <span className="text-text-primary font-medium">{database.name}</span>
        </div>
      </td>
      <td className="table-td">
        {latestBackup ? (
          <div>
            <div className="flex items-center gap-2">
              {latestBackup.status === 'success' && <span className="text-status-success">✓</span>}
              {latestBackup.status === 'failed' && <span className="text-status-error">✗</span>}
              {latestBackup.status === 'running' && <span className="text-accent">●</span>}
              <span className="text-text-secondary">{formatTime(latestBackup.startTime)}</span>
              {latestBackup.size && (
                <span className="text-text-muted">({formatSize(latestBackup.size)})</span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-text-muted">No backups yet</span>
        )}
      </td>
      <td className="table-td text-text-secondary">
        {formatNextRun(nextRun)}
      </td>
      <td className="table-td">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm" onClick={() => onBackup(database.id)}>
            Backup
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSchedule(database.id)}>
            Schedule
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSettings(database.id)}>
            Settings
          </Button>
        </div>
      </td>
    </tr>
  );
}
