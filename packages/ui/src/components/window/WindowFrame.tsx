import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { TitleBar } from './TitleBar';
import { TrafficLights } from './TrafficLights';
import { ResizeHandles, type ResizeHandle } from './ResizeHandles';

export interface WindowFrameProps {
  title: string;
  children: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized?: boolean;
  isActive?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  minWidth?: number;
  minHeight?: number;
  className?: string;
}

export function WindowFrame({
  title,
  children,
  x,
  y,
  width,
  height,
  zIndex,
  isMinimized = false,
  isActive = true,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  minWidth = 200,
  minHeight = 150,
  className,
}: WindowFrameProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showOpenAnimation, setShowOpenAnimation] = useState(true);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowOpenAnimation(false), 220);
    return () => window.clearTimeout(timer);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onFocus();

      const target = e.target as HTMLElement;

      // Don't initiate drag from interactive elements or resize handles
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[data-resize]')
      ) {
        return;
      }

      if (target.closest('.window-title-bar')) {
        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
      }
    },
    [onFocus, x, y],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onMove(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onMove]);

  const handleResize = useCallback(
    (handle: ResizeHandle, dx: number, dy: number) => {
      setIsResizing(true);
      let newWidth = width;
      let newHeight = height;

      if (handle === 'se' || handle === 'e') {
        newWidth = Math.max(minWidth, width + dx);
      }
      if (handle === 'se' || handle === 's') {
        newHeight = Math.max(minHeight, height + dy);
      }

      onResize(newWidth, newHeight);
    },
    [width, height, minWidth, minHeight, onResize],
  );

  // Clear resizing flag when mouse is released
  useEffect(() => {
    const clearResize = () => setIsResizing(false);
    document.addEventListener('mouseup', clearResize);
    return () => document.removeEventListener('mouseup', clearResize);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'w' && e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isActive && windowRef.current && !windowRef.current.contains(document.activeElement)) {
      windowRef.current.focus({ preventScroll: true });
    }
  }, [isActive]);

  if (isMinimized) return null;

  const interacting = isDragging || isResizing;

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      className={cn(
        'absolute os-glass-window rounded-xl overflow-hidden',
        'focus:outline-none',
        showOpenAnimation && !interacting && 'animate-os-scale-in',
        !interacting && 'transition-shadow duration-normal ease-out',
        isActive ? 'shadow-window' : 'shadow-md',
        className,
      )}
      style={{ left: x, top: y, width, height, zIndex }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      <TitleBar
        title={title}
        isActive={isActive}
        onDoubleClick={onMaximize}
        trafficLights={
          <TrafficLights
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            isActive={isActive}
          />
        }
      />

      <div className="overflow-auto bg-background text-foreground" style={{ height: height - 32 }}>
        {children}
      </div>

      <ResizeHandles
        onResize={handleResize}
        windowWidth={width}
        windowHeight={height}
      />
    </div>
  );
}
