import { useMemo } from 'react';
import type { AppManifest } from '@aspect/os-core';
import { cn } from '../../lib/utils';
import { DesktopIcon } from './DesktopIcon';

export interface DesktopFileItem {
  name: string;
  type: string;
  icon?: string;
}

export interface DesktopIconGridProps {
  apps: AppManifest[];
  files?: DesktopFileItem[];
  onLaunchApp: (appId: string) => void;
  onOpenFile?: (filename: string) => void;
  onDragStart?: (id: string, type: 'app' | 'file', e: React.DragEvent) => void;
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
  className?: string;
}

export function DesktopIconGrid({
  apps,
  files = [],
  onLaunchApp,
  onOpenFile,
  onDragStart,
  selectedItems = [],
  onSelectItem,
  className,
}: DesktopIconGridProps) {
  const visibleApps = useMemo(
    () => apps.filter((app) => !app.hidden),
    [apps],
  );

  return (
    <div
      className={cn(
        'absolute right-2 top-2 flex flex-col-reverse flex-wrap-reverse content-end gap-1',
        'pointer-events-none h-[calc(100%-4rem)]',
        className,
      )}
      role="grid"
      aria-label="Desktop icons"
    >
      {visibleApps.map((app) => (
        <div key={app.id} className="pointer-events-auto" role="gridcell">
          <DesktopIcon
            id={app.id}
            name={app.name}
            icon={app.icon ?? '📦'}
            isSelected={selectedItems.includes(app.id)}
            onDoubleClick={() => onLaunchApp(app.id)}
            onClick={() => onSelectItem?.(app.id)}
            onDragStart={(e) => onDragStart?.(app.id, 'app', e)}
          />
        </div>
      ))}

      {files.map((file) => (
        <div key={file.name} className="pointer-events-auto" role="gridcell">
          <DesktopIcon
            id={file.name}
            name={file.name}
            icon={file.icon ?? '📄'}
            isSelected={selectedItems.includes(file.name)}
            onDoubleClick={() => onOpenFile?.(file.name)}
            onClick={() => onSelectItem?.(file.name)}
            onDragStart={(e) => onDragStart?.(file.name, 'file', e)}
          />
        </div>
      ))}
    </div>
  );
}
