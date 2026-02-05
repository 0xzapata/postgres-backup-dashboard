import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type StatusType = 'idle' | 'running' | 'success' | 'failed' | 'paused';

export interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md';
  showText?: boolean;
}

export function StatusIndicator({ status, size = 'md', showText = false }: StatusIndicatorProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
  };
  
  const statusConfig = {
    idle: {
      color: 'bg-text-muted',
      text: 'Idle',
      symbol: '○',
    },
    running: {
      color: 'bg-accent animate-pulse',
      text: 'Running',
      symbol: '●',
    },
    success: {
      color: 'bg-status-success',
      text: 'Success',
      symbol: '✓',
    },
    failed: {
      color: 'bg-status-error',
      text: 'Failed',
      symbol: '✗',
    },
    paused: {
      color: 'bg-status-warning',
      text: 'Paused',
      symbol: '⏸️',
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={twMerge(clsx('flex items-center gap-2', size === 'sm' && 'text-xs'))}>
      <span className={twMerge(clsx(sizes[size], 'rounded-none', config.color))}></span>
      {showText && (
        <span className="text-text-secondary">{config.text}</span>
      )}
    </div>
  );
}
