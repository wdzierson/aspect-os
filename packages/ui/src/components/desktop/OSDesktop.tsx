import { type ReactNode, useEffect, useMemo, useCallback, useRef } from 'react';
import type { AppManifest } from '@aspect/os-core';
import { appRegistry } from '@aspect/os-core';
import { cn } from '../../lib/utils';
import { DesktopSurface } from './DesktopSurface';
import { DesktopIconGrid } from './DesktopIconGrid';
import { TrashIcon, type TrashDropItem } from './TrashIcon';

export interface DesktopApp extends AppManifest {
  component: React.ComponentType<any>;
}

export interface OSDesktopProps {
  wallpaper?: string;
  apps: DesktopApp[];
  children?: ReactNode;
  showTrash?: boolean;
  className?: string;
  onAppLaunch?: (appId: string) => void;
  onDesktopClick?: () => void;
}

export function OSDesktop({
  wallpaper,
  apps,
  children,
  showTrash = true,
  className,
  onAppLaunch,
  onDesktopClick,
}: OSDesktopProps) {
  const registeredRef = useRef(new Set<string>());

  useEffect(() => {
    for (const app of apps) {
      if (registeredRef.current.has(app.id)) continue;
      try {
        appRegistry.registerApp({
          id: app.id,
          name: app.name,
          icon: app.icon,
          defaultTitle: app.defaultTitle,
          defaultWidth: app.defaultWidth,
          defaultHeight: app.defaultHeight,
          windowless: app.windowless,
          preferredPosition: app.preferredPosition,
          fileAssociations: app.fileAssociations,
          hidden: app.hidden,
        });
        registeredRef.current.add(app.id);
      } catch {
        // Already registered — safe to ignore on HMR re-mounts
      }
    }
  }, [apps]);

  const componentMap = useMemo(() => {
    const map = new Map<string, React.ComponentType<any>>();
    for (const app of apps) {
      map.set(app.id, app.component);
    }
    return map;
  }, [apps]);

  const handleLaunch = useCallback(
    (appId: string) => {
      appRegistry.launchApp(appId);
      onAppLaunch?.(appId);
    },
    [onAppLaunch],
  );

  const handleTrashDrop = useCallback((item: TrashDropItem) => {
    // Consumers can hook into the OS event bus for trash events.
    // Default behavior: log and ignore. Apps should override via onDrop.
    console.debug('[OSDesktop] Trash drop:', item);
  }, []);

  const manifests = useMemo(
    () =>
      apps.map(({ component: _, ...manifest }) => manifest as AppManifest),
    [apps],
  );

  return (
    <DesktopSurface
      wallpaper={wallpaper}
      onDesktopClick={onDesktopClick}
      className={cn(className)}
    >
      <div className="relative h-full pt-8">
        <DesktopIconGrid apps={manifests} onLaunchApp={handleLaunch} />

        {/*
          WindowRenderer is expected to be provided by the consumer or a
          higher-level shell component. The componentMap is available for
          it via the apps prop passed to this component.
        */}

        {showTrash && (
          <TrashIcon onDrop={handleTrashDrop} />
        )}

        {children}
      </div>
    </DesktopSurface>
  );
}
