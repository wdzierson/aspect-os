import { useState, useRef, useEffect, useCallback, type ReactNode, type KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';
import { TrafficLights } from './TrafficLights';

export interface WindowlessFrameProps {
  children: ReactNode;
  x: number;
  y: number;
  zIndex: number;
  title: string;
  isActive?: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
}

export function WindowlessFrame({
  children,
  x,
  y,
  zIndex,
  title,
  isActive = true,
  onClose,
  onFocus,
  onMove,
}: WindowlessFrameProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('.drag-handle')) {
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
          x: e.clientX,
          y: e.clientY,
          initialX: x,
          initialY: y,
        };
      }

      onFocus();
    },
    [onFocus, x, y],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onMove(dragStart.current.initialX + dx, dragStart.current.initialY + dy);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onMove]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'w' && e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isActive && frameRef.current && !frameRef.current.contains(document.activeElement)) {
      frameRef.current.focus({ preventScroll: true });
    }
  }, [isActive]);

  return (
    <div
      ref={frameRef}
      role="region"
      aria-label={title}
      tabIndex={-1}
      className="absolute group focus:outline-none"
      style={{ left: x, top: y, zIndex }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      {/* Hover-activated control bar */}
      <div
        className={cn(
          'drag-handle absolute -top-7 inset-x-0 h-7',
          'bg-window-title/80 backdrop-blur-sm',
          'border border-window-border/50 rounded-t-lg',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-normal',
          'flex items-center justify-between px-2 cursor-move',
        )}
      >
        <TrafficLights
          onClose={onClose}
          isActive={isActive}
        />
        <div className="text-xs font-medium text-center flex-1 px-2 truncate text-foreground pointer-events-none">
          {title}
        </div>
        <div className="w-12 shrink-0" />
      </div>

      {/* Subtle border overlay on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg pointer-events-none',
          'border border-window-border/50 bg-glass-bg/30 backdrop-blur-sm',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-normal',
        )}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
