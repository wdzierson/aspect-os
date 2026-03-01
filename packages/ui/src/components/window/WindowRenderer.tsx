import { createElement, useMemo, useRef, useEffect, useState, type ComponentType } from 'react';
import type { WindowState, AppManifest, AppContext } from '@aspect/os-core';
import { useOSStore } from '../../store/OSStoreContext';
import { WindowFrame } from './WindowFrame';
import { WindowlessFrame } from './WindowlessFrame';
import { WindowErrorBoundary } from './WindowErrorBoundary';

export interface WindowRendererProps {
  appComponentMap: Map<string, ComponentType<any>>;
  onWindowFocus?: (windowId: string) => void;
  onWindowClose?: (windowId: string) => void;
  onWindowMove?: (windowId: string, x: number, y: number) => void;
  onWindowResize?: (windowId: string, width: number, height: number) => void;
  onWindowMinimize?: (windowId: string) => void;
  onWindowMaximize?: (windowId: string) => void;
}

export function WindowRenderer({
  appComponentMap,
  onWindowFocus,
  onWindowClose,
  onWindowMove,
  onWindowResize,
  onWindowMinimize,
  onWindowMaximize,
}: WindowRendererProps) {
  const windows = useOSStore((s) => s.windows);
  const apps = useOSStore((s) => s.apps);
  const activeWindowId = useOSStore((s) => s.ui.activeWindow);

  const appsByIdMap = useMemo(() => {
    const map = new Map<string, AppManifest>();
    for (const app of apps) {
      map.set(app.id, app);
    }
    return map;
  }, [apps]);

  const windowEntries = useMemo(() => Array.from(windows.entries()), [windows]);

  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const prevWindowIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(windows.keys());
    const prevIds = prevWindowIdsRef.current;

    for (const [id, state] of windows.entries()) {
      if (!prevIds.has(id)) {
        setLiveAnnouncement(`${state.title} window opened`);
      }
    }
    for (const id of prevIds) {
      if (!currentIds.has(id)) {
        setLiveAnnouncement('Window closed');
      }
    }

    prevWindowIdsRef.current = currentIds;
  }, [windows]);

  return (
    <>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>
      {windowEntries.map(([windowId, windowState]) => {
        const manifest = appsByIdMap.get(windowState.appId);
        const AppComponent = appComponentMap.get(windowState.appId);

        if (!AppComponent) return null;

        const context: AppContext = {
          windowId,
          windowState,
          metadata: windowState.metadata,
        };

        const isActive = activeWindowId === windowId;

        if (manifest?.windowless) {
          return (
            <WindowlessFrame
              key={windowId}
              x={windowState.x}
              y={windowState.y}
              zIndex={windowState.zIndex}
              title={windowState.title}
              isActive={isActive}
              onClose={() => onWindowClose?.(windowId)}
              onFocus={() => onWindowFocus?.(windowId)}
              onMove={(x, y) => onWindowMove?.(windowId, x, y)}
            >
              <WindowErrorBoundary windowTitle={windowState.title}>
                {createElement(AppComponent, { context })}
              </WindowErrorBoundary>
            </WindowlessFrame>
          );
        }

        return (
          <WindowFrame
            key={windowId}
            title={windowState.title}
            x={windowState.x}
            y={windowState.y}
            width={windowState.width}
            height={windowState.height}
            zIndex={windowState.zIndex}
            isMinimized={windowState.isMinimized}
            isActive={isActive}
            onClose={() => onWindowClose?.(windowId)}
            onMinimize={() => onWindowMinimize?.(windowId)}
            onMaximize={() => onWindowMaximize?.(windowId)}
            onFocus={() => onWindowFocus?.(windowId)}
            onMove={(x, y) => onWindowMove?.(windowId, x, y)}
            onResize={(w, h) => onWindowResize?.(windowId, w, h)}
          >
            <WindowErrorBoundary windowTitle={windowState.title}>
              {createElement(AppComponent, { context })}
            </WindowErrorBoundary>
          </WindowFrame>
        );
      })}
    </>
  );
}
