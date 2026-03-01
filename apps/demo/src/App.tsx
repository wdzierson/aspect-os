import './index.css';
import { useMemo, useCallback } from 'react';
import { windowManager } from '@aspect/os-core';
import {
  OSProvider,
  OSDesktop,
  SystemMenuBar,
  SystemTray,
  WindowRenderer,
} from '@aspect/os-ui';
import { TextEditor } from './apps/TextEditor';
import { Calculator } from './apps/Calculator';
import { Settings } from './apps/Settings';

const WALLPAPER = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

const apps = [
  {
    id: 'textedit',
    name: 'TextEdit',
    icon: '📝',
    defaultTitle: 'TextEdit',
    defaultWidth: 600,
    defaultHeight: 400,
    component: TextEditor,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    defaultTitle: 'Calculator',
    defaultWidth: 320,
    defaultHeight: 480,
    preferredPosition: 'center' as const,
    component: Calculator,
  },
  {
    id: 'settings',
    name: 'System Preferences',
    icon: '⚙️',
    defaultTitle: 'System Preferences',
    defaultWidth: 700,
    defaultHeight: 500,
    component: Settings,
  },
];

function Desktop() {
  const componentMap = useMemo(() => {
    const map = new Map<string, React.ComponentType<any>>();
    for (const app of apps) map.set(app.id, app.component);
    return map;
  }, []);

  const onFocus = useCallback((id: string) => windowManager.focusWindow(id), []);
  const onClose = useCallback((id: string) => windowManager.closeWindow(id), []);
  const onMove = useCallback((id: string, x: number, y: number) => windowManager.updateWindow(id, { x, y }), []);
  const onResize = useCallback((id: string, w: number, h: number) => windowManager.updateWindow(id, { width: w, height: h }), []);
  const onMinimize = useCallback((id: string) => windowManager.minimizeWindow(id), []);
  const onMaximize = useCallback((id: string) => windowManager.maximizeWindow(id), []);

  return (
    <OSDesktop wallpaper={WALLPAPER} apps={apps}>
      <WindowRenderer
        appComponentMap={componentMap}
        onWindowFocus={onFocus}
        onWindowClose={onClose}
        onWindowMove={onMove}
        onWindowResize={onResize}
        onWindowMinimize={onMinimize}
        onWindowMaximize={onMaximize}
      />
    </OSDesktop>
  );
}

export default function App() {
  return (
    <OSProvider>
      <SystemMenuBar activeAppName="Finder" rightContent={<SystemTray />} />
      <Desktop />
    </OSProvider>
  );
}
