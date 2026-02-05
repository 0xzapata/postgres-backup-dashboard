import React from 'react';
import { Card } from './Card';

export interface StatCard {
  label: string;
  value: string | number;
  subtitle?: string;
}

export interface QuickStatsProps {
  stats: StatCard[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex flex-col justify-center">
          <p className="text-text-secondary text-sm mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-text-primary mb-1">{stat.value}</p>
          {stat.subtitle && (
            <p className="text-text-muted text-xs">{stat.subtitle}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
