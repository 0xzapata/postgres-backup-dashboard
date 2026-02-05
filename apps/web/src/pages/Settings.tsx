import React from 'react';
import { Card } from '@postgres-backup-dashboard/ui';
import { Button } from '@postgres-backup-dashboard/ui';
import { Input } from '@postgres-backup-dashboard/ui';

export default function Settings() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b-1 border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* General Settings */}
        <Card>
          <h2 className="text-text-primary font-semibold mb-6 pb-4 border-b-1 border-border">GENERAL</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                Default retention
              </label>
              <select className="input">
                <option>7 days</option>
                <option>14 days</option>
                <option selected>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                Default compression
              </label>
              <select className="input">
                <option>gzip</option>
                <option>zstd</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                Timezone
              </label>
              <select className="input">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>America/Los_Angeles</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        </Card>
        
        {/* Notifications */}
        <Card>
          <h2 className="text-text-primary font-semibold mb-6 pb-4 border-b-1 border-border">NOTIFICATIONS</h2>
          
          <div className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
            />
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-text-primary">Notify on backup failure</div>
                <div className="text-text-muted text-sm">Receive alerts when backups fail</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent bg-bg-secondary border-border" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-text-primary">Notify on backup success</div>
                <div className="text-text-muted text-sm">Receive confirmation when backups complete</div>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-accent bg-bg-secondary border-border" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-text-primary">Storage quota warning</div>
                <div className="text-text-muted text-sm">Alert when approaching storage limits</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent bg-bg-secondary border-border" />
            </div>
          </div>
        </Card>
        
        {/* Storage */}
        <Card>
          <h2 className="text-text-primary font-semibold mb-6 pb-4 border-b-1 border-border">STORAGE</h2>
          
          <div className="space-y-6">
            <div>
              <div className="text-text-secondary text-sm mb-1">Bucket</div>
              <div className="text-text-primary">postgres-backups</div>
            </div>
            
            <div>
              <div className="text-text-secondary text-sm mb-1">Region</div>
              <div className="text-text-primary">us-east-1</div>
            </div>
            
            <div>
              <div className="text-text-secondary text-sm mb-1">Used</div>
              <div className="text-text-primary">452.3 GB / 1 TB</div>
              <div className="mt-2 w-full bg-bg-tertiary border-1 border-border h-2">
                <div className="bg-accent h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-status-error/20">
          <h2 className="text-status-error font-semibold mb-6 pb-4 border-b-1 border-status-error/20">DANGER ZONE</h2>
          
          <div className="space-y-4">
            <Button variant="danger" className="w-full">
              Delete all backups (irreversible)
            </Button>
            <Button variant="secondary" className="w-full">
              Purge failed backups
            </Button>
          </div>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="primary">Save Settings</Button>
        </div>
      </main>
    </div>
  );
}
