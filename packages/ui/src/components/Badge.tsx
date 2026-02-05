import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'neutral' | 'accent';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  const variants = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    neutral: 'badge-neutral',
    accent: 'badge-accent',
  };
  
  return (
    <div
      className={twMerge(clsx('badge', variants[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
}
