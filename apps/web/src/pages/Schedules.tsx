import React from 'react';
import { Card } from '@postgres-backup-dashboard/ui';
import { Button } from '@postgres-backup-dashboard/ui';
import { Table } from '@postgres-backup-dashboard/ui';
import { ScheduleRow } from '@postgres-backup-dashboard/ui';
import { Schedule, DatabaseConfig } from '@postgres-backup-dashboard/types';

export default function Schedules() {
  // Mock data
  const schedules: (Schedule & { databaseName: string })[] = [
    {
      id: 's1',
      databaseId: '1',
      name: 'Daily Backup',
      cronExpression: 'Every 2 hours',
      timezone: 'UTC',
      enabled: true,
      nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      notificationEnabled: true,
      databaseName: 'prod-main',
    },
    {
      id: 's2',
      databaseId: '1',
      name: 'Weekly Full',
      cronExpression: 'Every Sunday 3am',
      timezone: 'UTC',
      enabled: true,
      nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notificationEnabled: true,
      databaseName: 'prod-main',
    },
    {
      id: 's3',
      databaseId: '4',
      name: 'Hourly',
      cronExpression: 'Every hour',
      timezone: 'UTC',
      enabled: true,
      nextRun: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      notificationEnabled: false,
      databaseName: 'staging',
    },
  ];
  
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b-1 border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text-primary">Schedules</h1>
            <Button variant="primary">＋ New Schedule</Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <Card>
          <Table
            headers={['Database', 'Schedule', 'Status', 'Next Run', 'Actions']}
            rows={schedules.map((schedule) => [
              <ScheduleRow
                key={schedule.id}
                schedule={schedule}
                databaseName={schedule.databaseName}
                onEdit={(id) => console.log('Edit', id)}
                onToggle={(id) => console.log('Toggle', id)}
              />,
            ])}
          />
        </Card>
      </main>
    </div>
  );
}
