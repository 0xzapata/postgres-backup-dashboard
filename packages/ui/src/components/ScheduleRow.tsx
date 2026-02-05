import React from 'react';
import { StatusIndicator } from './StatusIndicator';
import { Button } from './Button';
import { Schedule } from '@postgres-backup-dashboard/types';

export interface ScheduleRowProps {
  schedule: Schedule;
  databaseName: string;
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
}

export function ScheduleRow({ schedule, databaseName, onEdit, onToggle }: ScheduleRowProps) {
  const formatNextRun = (timestamp: string) => {
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
  
  return (
    <tr className="table-tr group">
      <td className="table-td">
        <div>
          <div className="text-text-primary font-medium">{databaseName}</div>
          <div className="text-text-secondary text-sm">{schedule.name}</div>
        </div>
      </td>
      <td className="table-td text-text-secondary">
        {schedule.cronExpression}
      </td>
      <td className="table-td">
        <StatusIndicator 
          status={schedule.enabled ? 'running' : 'paused'} 
          showText 
        />
      </td>
      <td className="table-td text-text-secondary">
        {formatNextRun(schedule.nextRun)}
      </td>
      <td className="table-td">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm" onClick={() => onEdit(schedule.id)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onToggle(schedule.id)}>
            {schedule.enabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </td>
    </tr>
  );
}
