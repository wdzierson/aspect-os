import { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TrashDropItem {
  id: string;
  type: 'app' | 'file';
  name: string;
}

export interface TrashIconProps {
  onDrop: (item: TrashDropItem) => void;
  onDoubleClick?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export function TrashIcon({
  onDrop,
  onDoubleClick,
  isEmpty = true,
  className,
}: TrashIconProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      try {
        const raw = e.dataTransfer.getData('application/os-desktop-item');
        if (!raw) return;
        const data = JSON.parse(raw) as { id: string; type: 'app' | 'file'; name?: string };
        onDrop({
          id: data.id,
          type: data.type,
          name: data.name ?? data.id,
        });
      } catch {
        // Invalid drag data — ignore
      }
    },
    [onDrop],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={isEmpty ? 'Trash (empty)' : 'Trash (contains items)'}
      className={cn(
        'absolute bottom-3 right-3 flex w-16 cursor-default select-none flex-col items-center gap-1',
        'rounded-lg p-1.5 outline-none transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-[var(--os-accent,#007AFF)]',
        isDragOver && 'scale-110 bg-[var(--os-accent,#007AFF)]/25 ring-2 ring-[var(--os-accent,#007AFF)]/50',
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDoubleClick?.();
      }}
    >
      <Trash2
        size={32}
        className={cn(
          'transition-colors',
          isEmpty
            ? 'text-[var(--os-text-secondary,#aaa)]'
            : 'text-[var(--os-text,#fff)]',
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'text-[11px] leading-tight',
          'text-[var(--os-text,#fff)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]',
        )}
      >
        Trash
      </span>
    </div>
  );
}
