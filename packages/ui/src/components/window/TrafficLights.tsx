import { cn } from '../../lib/utils';

export interface TrafficLightsProps {
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isActive?: boolean;
  className?: string;
}

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  isActive = true,
  className,
}: TrafficLightsProps) {
  return (
    <div role="group" aria-label="Window controls" className={cn('group/lights flex items-center gap-2', className)}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={cn(
          'relative w-3 h-3 rounded-full transition-colors duration-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive ? 'bg-mac-red shadow-sm' : 'bg-muted-foreground/30',
        )}
        aria-label="Close window"
      >
        <span className="sr-only">Close (red)</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMinimize?.();
        }}
        className={cn(
          'relative w-3 h-3 rounded-full transition-colors duration-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive ? 'bg-mac-yellow shadow-sm' : 'bg-muted-foreground/30',
        )}
        aria-label="Minimize window"
      >
        <span className="sr-only">Minimize (yellow)</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMaximize?.();
        }}
        className={cn(
          'relative w-3 h-3 rounded-full transition-colors duration-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive ? 'bg-mac-green shadow-sm' : 'bg-muted-foreground/30',
        )}
        aria-label="Maximize window"
      >
        <span className="sr-only">Maximize (green)</span>
      </button>
    </div>
  );
}
