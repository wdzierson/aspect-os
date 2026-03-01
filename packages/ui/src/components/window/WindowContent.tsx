import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface WindowContentProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function WindowContent({
  children,
  className,
  padding = true,
}: WindowContentProps) {
  return (
    <div
      className={cn(
        'os-window-content os-scrollbar',
        padding && 'p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
