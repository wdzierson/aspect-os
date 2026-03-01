import { type ReactNode, useCallback } from 'react';
import { cn } from '../../lib/utils';

export interface DesktopIconProps {
  id: string;
  name: string;
  icon: string | ReactNode;
  isSelected?: boolean;
  isDraggable?: boolean;
  onDoubleClick: () => void;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
}

export function DesktopIcon({
  id,
  name,
  icon,
  isSelected = false,
  isDraggable = true,
  onDoubleClick,
  onClick,
  onDragStart,
  className,
}: DesktopIconProps) {
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData(
        'application/os-desktop-item',
        JSON.stringify({ id, type: 'app' }),
      );
      e.dataTransfer.effectAllowed = 'move';
      onDragStart?.(e);
    },
    [id, onDragStart],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onDoubleClick();
      }
    },
    [onDoubleClick],
  );

  const isEmoji = typeof icon === 'string';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${name} application`}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex w-16 cursor-default select-none flex-col items-center gap-1 rounded-lg p-1.5',
        'outline-none transition-transform duration-150',
        'hover:scale-105',
        'focus-visible:ring-2 focus-visible:ring-[var(--os-accent,#007AFF)]',
        isSelected &&
          'bg-[var(--os-accent,#007AFF)]/20 ring-1 ring-[var(--os-accent,#007AFF)]/40',
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        {isEmoji ? (
          <span className="text-3xl leading-none" aria-hidden="true">
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>
      <span
        className={cn(
          'line-clamp-2 max-w-full text-center text-[11px] leading-tight',
          'text-[var(--os-text,#fff)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]',
        )}
        title={name}
      >
        {name}
      </span>
    </div>
  );
}
