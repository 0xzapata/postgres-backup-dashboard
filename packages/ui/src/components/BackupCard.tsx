import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Backup } from '@postgres-backup-dashboard/types';

export interface BackupCardProps {
  backup: Backup;
  databaseName: string;
  onDownload: () => void;
  onView: () => void;
}

export function BackupCard({ backup, databaseName, onDownload, onView }: BackupCardProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };
  
  const formatDuration = (ms?: number) => {
    if (!ms) return '—';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };
  
  const getStatusBadge = () => {
    switch (backup.status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'running':
        return <Badge variant="accent">Running</Badge>;
    }
  };
  
  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-text-primary font-semibold">{databaseName}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{formatTime(backup.startTime)}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{formatSize(backup.size)}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{formatDuration(backup.duration)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t-1 border-border">
        {backup.status === 'success' && (
          <Button variant="secondary" size="sm" onClick={onDownload} className="flex-1">
            Download
          </Button>
        )}
        {backup.status === 'failed' && (
          <Button variant="danger" size="sm" onClick={onView} className="flex-1">
            View
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onView}>
          →
        </Button>
      </div>
    </Card>
  );
}
