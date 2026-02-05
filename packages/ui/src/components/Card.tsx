import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export function Card({ noPadding, className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(clsx('card', !noPadding && 'p-4', className))}
      {...props}
    >
      {children}
    </div>
  );
}
