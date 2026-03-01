import { useEffect, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';

export type ResizeHandle = 'se' | 'e' | 's';

export interface ResizeHandlesProps {
  onResize: (handle: ResizeHandle, deltaX: number, deltaY: number) => void;
  windowWidth: number;
  windowHeight: number;
  className?: string;
  disabled?: boolean;
}

export function ResizeHandles({
  onResize,
  windowWidth,
  windowHeight,
  className,
  disabled = false,
}: ResizeHandlesProps) {
  const activeHandle = useRef<ResizeHandle | null>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (handle: ResizeHandle) => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      activeHandle.current = handle;
      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [disabled],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeHandle.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onResize(activeHandle.current, dx, dy);
    };

    const handleMouseUp = () => {
      activeHandle.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  if (disabled) return null;

  return (
    <div className={cn('pointer-events-none', className)} aria-hidden="true">
      {/* Bottom-right corner */}
      <div
        data-resize="se"
        onMouseDown={handleMouseDown('se')}
        className="pointer-events-auto absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-40 transition-opacity duration-fast"
        style={{
          background:
            'radial-gradient(circle at 2px 2px, hsl(var(--os-muted-foreground)) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />
      {/* Right edge */}
      <div
        data-resize="e"
        onMouseDown={handleMouseDown('e')}
        className="pointer-events-auto absolute top-8 right-0 w-1 cursor-e-resize hover:bg-primary/20 transition-colors duration-fast"
        style={{ height: windowHeight - 36 }}
      />
      {/* Bottom edge */}
      <div
        data-resize="s"
        onMouseDown={handleMouseDown('s')}
        className="pointer-events-auto absolute bottom-0 left-0 h-1 cursor-s-resize hover:bg-primary/20 transition-colors duration-fast"
        style={{ width: windowWidth - 16 }}
      />
    </div>
  );
}
