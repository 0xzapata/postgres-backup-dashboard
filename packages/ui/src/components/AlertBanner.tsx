import React from 'react';
import { Badge } from './Badge';

export interface AlertBannerProps {
  databaseName: string;
  message: string;
  onDismiss: () => void;
}

export function AlertBanner({ databaseName, message, onDismiss }: AlertBannerProps) {
  return (
    <div className="card p-4 border-l-4 border-l-status-error bg-status-error/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-status-error text-lg">●</span>
          <div>
            <p className="text-text-primary font-medium">{databaseName}: {message}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-text-secondary hover:text-text-primary px-3 py-1 text-sm"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
