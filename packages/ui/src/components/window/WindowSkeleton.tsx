import { cn } from '../../lib/utils';

export interface WindowSkeletonProps {
  width?: number;
  height?: number;
  className?: string;
}

export function WindowSkeleton({
  width = 500,
  height = 350,
  className,
}: WindowSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden os-glass-window',
        'animate-pulse',
        className,
      )}
      style={{ width, height }}
      role="status"
      aria-label="Loading window"
    >
      {/* Fake title bar */}
      <div className="h-8 bg-window-chrome/60 flex items-center px-4 gap-2 border-b border-window-border/50">
        <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
        <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
        <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
        <div className="flex-1 flex justify-center">
          <div className="w-24 h-3 rounded bg-muted-foreground/15" />
        </div>
        <div className="w-16" />
      </div>

      {/* Fake content area */}
      <div className="p-4 space-y-3" style={{ height: height - 32 }}>
        <div className="w-3/4 h-3 rounded bg-muted-foreground/10" />
        <div className="w-1/2 h-3 rounded bg-muted-foreground/10" />
        <div className="w-5/6 h-3 rounded bg-muted-foreground/10" />
        <div className="w-2/3 h-3 rounded bg-muted-foreground/10" />
      </div>
    </div>
  );
}
