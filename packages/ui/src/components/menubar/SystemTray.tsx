import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ClockWidget } from './ClockWidget';

export interface SystemTrayProps {
  children?: ReactNode;
  className?: string;
}

export const SystemTray = ({ children, className }: SystemTrayProps) => (
  <div
    className={cn('flex items-center gap-3 px-2', className)}
    role="status"
    aria-label="System tray"
  >
    {children ?? <ClockWidget />}
  </div>
);
