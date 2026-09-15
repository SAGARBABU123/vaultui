import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-neutral-200 rounded-xl overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5 border-b border-neutral-100", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 bg-neutral-50 border-t border-neutral-100", className)}>{children}</div>;
}
