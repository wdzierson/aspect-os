import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { TrafficLights, type TrafficLightsProps } from './TrafficLights';

export interface TitleBarProps {
  title: string;
  isActive?: boolean;
  onDoubleClick?: () => void;
  children?: ReactNode;
  className?: string;
  trafficLights?: ReactNode;
}

export function TitleBar({
  title,
  isActive = true,
  onDoubleClick,
  children,
  className,
  trafficLights,
}: TitleBarProps) {
  return (
    <div
      role="toolbar"
      aria-label={`${title} title bar`}
      className={cn(
        'window-title-bar h-8 flex items-center justify-between px-4',
        'border-b border-window-border/50 select-none',
        'transition-colors duration-normal',
        isActive
          ? 'bg-window-title backdrop-blur-md'
          : 'bg-window-title/60 backdrop-blur-md',
        className,
      )}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center gap-2 shrink-0">
        {trafficLights ?? children}
      </div>

      <div
        className={cn(
          'text-sm font-medium text-center flex-1 px-4 truncate',
          'transition-colors duration-normal pointer-events-none',
          isActive ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {title}
      </div>

      {/* Spacer to balance the traffic lights and keep the title centered */}
      <div className="w-16 shrink-0" />
    </div>
  );
}
