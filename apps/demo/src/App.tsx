import './index.css';
import { useState, useMemo, useEffect } from 'react';
import {
  OSProvider,
  OSDesktop,
  SystemMenuBar,
  SystemTray,
  WindowRenderer,
  useOSServices,
  useOSStore,
  type MenuItem,
} from '@aspect/os-ui';
import { MessageCircle, FileText, Settings, Terminal, LayoutGrid } from 'lucide-react';
import { ChatApp } from './apps/ChatApp';
import { NotepadApp } from './apps/NotepadApp';
import { PreferencesApp } from './apps/PreferencesApp';
import { TerminalApp } from './apps/TerminalApp';
import { ComponentShowcase } from './apps/ComponentShowcase';
import { LoginScreen } from './components/LoginScreen';
import { getDesktopBackground, subscribeDesktopBackground } from './desktopBackground';
import { getDesktopFiles, subscribeDesktopFiles } from './desktopFiles';
import {
  getUIPreferences,
  subscribeUIPreferences,
  getInterfaceScale,
  getTextScale,
  getThemeMode,
  type UIPreferences,
} from './uiPreferences';

const DEFAULT_WALLPAPER =
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)';

function AppIcon({ icon: Icon }: { icon: React.ComponentType<any> }) {
  return (
    <Icon
      className="text-white drop-shadow-lg"
      strokeWidth={1.5}
      style={{
        width: 'calc(36px * var(--aspect-ui-scale, 1))',
        height: 'calc(36px * var(--aspect-ui-scale, 1))',
      }}
    />
  );
}

const appDefinitions = [
  {
    id: 'chat',
    name: 'Messages',
    icon: <AppIcon icon={MessageCircle} />,
    defaultTitle: 'Messages',
    defaultWidth: 680,
    defaultHeight: 500,
    component: ChatApp,
  },
  {
    id: 'notepad',
    name: 'Notes',
    icon: <AppIcon icon={FileText} />,
    defaultTitle: 'Untitled — Notes',
    defaultWidth: 600,
    defaultHeight: 450,
    component: NotepadApp,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: <AppIcon icon={Terminal} />,
    defaultTitle: 'Terminal',
    defaultWidth: 640,
    defaultHeight: 420,
    component: TerminalApp,
  },
  {
    id: 'showcase',
    name: 'Components',
    icon: <AppIcon icon={LayoutGrid} />,
    defaultTitle: 'Component Showcase',
    defaultWidth: 800,
    defaultHeight: 600,
    component: ComponentShowcase,
  },
  {
    id: 'preferences',
    name: 'Preferences',
    icon: <AppIcon icon={Settings} />,
    defaultTitle: 'System Preferences',
    defaultWidth: 720,
    defaultHeight: 520,
    preferredPosition: 'center' as const,
    component: PreferencesApp,
  },
];

const APP_MENUS: Record<string, MenuItem[][]> = {
  chat: [
    [
      { label: 'New Conversation', action: 'chat-new', shortcut: '⌘N' },
      { separator: true },
      { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
    ],
    [
      { label: 'Cut', action: 'cut', shortcut: '⌘X' },
      { label: 'Copy', action: 'copy', shortcut: '⌘C' },
      { label: 'Paste', action: 'paste', shortcut: '⌘V' },
    ],
    [
      { label: 'Toggle Typing Indicator', action: 'chat-toggle-typing' },
      { label: 'Attach File…', action: 'chat-attach' },
    ],
  ],
  notepad: [
    [
      { label: 'New Note', action: 'notes-new', shortcut: '⌘N' },
      { label: 'Save', action: 'notes-save', shortcut: '⌘S' },
      { separator: true },
      { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
    ],
    [
      { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
      { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
    ],
  ],
  terminal: [
    [
      { label: 'New Tab', action: 'terminal-new-tab', shortcut: '⌘T' },
      { label: 'Clear', action: 'terminal-clear', shortcut: '⌃L' },
      { separator: true },
      { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
    ],
    [
      { label: 'Copy', action: 'copy', shortcut: '⌘C' },
      { label: 'Paste', action: 'paste', shortcut: '⌘V' },
    ],
  ],
  showcase: [
    [
      { label: 'Refresh Components', action: 'showcase-refresh' },
      { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
    ],
    [
      { label: 'View Docs', action: 'showcase-docs' },
      { label: 'Export Examples', action: 'showcase-export' },
    ],
  ],
  preferences: [
    [
      { label: 'General', action: 'prefs-general' },
      { label: 'Appearance', action: 'prefs-appearance' },
      { label: 'Desktop & Wallpaper', action: 'prefs-desktop' },
      { separator: true },
      { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
    ],
  ],
};

const APP_MENU_LABELS: Record<string, string[]> = {
  chat: ['File', 'Edit', 'Messages'],
  notepad: ['File', 'Edit'],
  terminal: ['Shell', 'Edit'],
  showcase: ['File', 'Actions'],
  preferences: ['Preferences'],
};

function useDarkModeInit() {
  useEffect(() => {
    const persistedTheme = getThemeMode();
    if (persistedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      return;
    }
    if (persistedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      return;
    }

    const envDark = import.meta.env.VITE_DARK_MODE;
    if (envDark === 'true') {
      document.documentElement.classList.add('dark');
    } else if (envDark === 'false') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);
}

function Desktop() {
  const { windowManager, appRegistry } = useOSServices();
  const windows = useOSStore((s) => s.windows);
  const activeWindow = useOSStore((s) => s.ui.activeWindow);
  const setActiveWindow = useOSStore((s) => s.setActiveWindow);
  const setFocusedApp = useOSStore((s) => s.setFocusedApp);
  const [wallpaper, setWallpaper] = useState(() => getDesktopBackground().value);
  const [uiPrefs, setUiPrefs] = useState<UIPreferences>(() => getUIPreferences());
  const [desktopFiles, setDesktopFiles] = useState(() => getDesktopFiles());

  useEffect(() => {
    setWallpaper(getDesktopBackground().value);
    return subscribeDesktopBackground((state) => setWallpaper(state.value));
  }, []);

  useEffect(() => {
    setUiPrefs(getUIPreferences());
    return subscribeUIPreferences(setUiPrefs);
  }, []);

  useEffect(() => {
    setDesktopFiles(getDesktopFiles());
    return subscribeDesktopFiles(setDesktopFiles);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const uiScale = getInterfaceScale(uiPrefs.interfaceSize);
    const textScale = getTextScale(uiPrefs.textSize);
    root.style.setProperty('--aspect-ui-scale', String(uiScale));
    root.style.setProperty('--aspect-text-scale', String(textScale));
    root.style.setProperty('--aspect-desktop-icon-size', `${Math.round(40 * uiScale)}px`);
    root.style.setProperty('--aspect-desktop-icon-slot', `${Math.round(88 * uiScale)}px`);
    root.style.setProperty('--aspect-desktop-label-size', `${Math.max(10, Math.round(11 * textScale))}px`);
    root.style.setProperty('--aspect-desktop-emoji-size', `${1.875 * uiScale}rem`);
  }, [uiPrefs]);

  const componentMap = useMemo(() => {
    const map = new Map<string, React.ComponentType<any>>();
    for (const app of appDefinitions) map.set(app.id, app.component);
    return map;
  }, []);

  const activeWindowId = useMemo(() => {
    if (activeWindow && windows.has(activeWindow)) return activeWindow;
    const topmost = Array.from(windows.values())
      .filter((w) => !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0];
    return topmost?.id ?? null;
  }, [activeWindow, windows]);

  const activeManifest = useMemo(() => {
    const state = activeWindowId ? windows.get(activeWindowId) : undefined;
    return appDefinitions.find((app) => app.id === state?.appId) ?? null;
  }, [activeWindowId, windows]);

  useEffect(() => {
    if (!activeWindowId) {
      setFocusedApp(null);
      return;
    }
    const state = windows.get(activeWindowId);
    setFocusedApp(state?.appId ?? null);
  }, [activeWindowId, windows, setFocusedApp]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: string }>).detail;
      if (detail?.action === 'close-window' && activeWindowId) {
        windowManager.closeWindow(activeWindowId);
      } else if (detail?.action === 'notes-new') {
        appRegistry.launchApp('notepad', undefined, { initialContent: '' });
      } else if (detail?.action === 'log-out') {
        window.dispatchEvent(new CustomEvent('os:auth-logout'));
      }
    };
    window.addEventListener('os:menu-action', handler);
    return () => window.removeEventListener('os:menu-action', handler);
  }, [activeWindowId, windowManager, appRegistry]);

  return (
    <>
      <SystemMenuBar
        activeAppId={activeManifest?.id}
        activeAppName={activeManifest?.name ?? 'Finder'}
        activeWindowId={activeWindowId}
        appMenus={APP_MENUS}
        appMenuLabels={APP_MENU_LABELS}
        rightContent={<SystemTray />}
      />
      <OSDesktop
        wallpaper={wallpaper}
        apps={appDefinitions}
        files={desktopFiles.map((file) => ({
          name: file.name,
          type: file.type,
          icon: <AppIcon icon={FileText} />,
        }))}
        onOpenFile={(filename) => {
          const file = desktopFiles.find((f) => f.name === filename);
          if (!file) return;
          appRegistry.launchApp('notepad', undefined, {
            initialContent: file.content,
            fileName: file.name,
          });
        }}
      >
      <WindowRenderer
        appComponentMap={componentMap}
        onWindowFocus={(id) => {
          windowManager.focusWindow(id);
          setActiveWindow(id);
        }}
        onWindowClose={(id) => {
          windowManager.closeWindow(id);
          if (activeWindowId === id) setActiveWindow(null);
        }}
        onWindowMove={(id, x, y) => windowManager.updateWindow(id, { x, y })}
        onWindowResize={(id, w, h) =>
          windowManager.updateWindow(id, { width: w, height: h })
        }
        onWindowMinimize={(id) => {
          windowManager.minimizeWindow(id);
          if (activeWindowId === id) setActiveWindow(null);
        }}
        onWindowMaximize={(id) => windowManager.maximizeWindow(id)}
      />
      </OSDesktop>
    </>
  );
}

export default function App() {
  useDarkModeInit();
  const [loggedIn, setLoggedIn] = useState(false);
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPER);
  const [uiPrefs, setUiPrefs] = useState<UIPreferences>(() => getUIPreferences());

  useEffect(() => {
    setWallpaper(getDesktopBackground().value);
    return subscribeDesktopBackground((state) => setWallpaper(state.value));
  }, []);

  useEffect(() => {
    setUiPrefs(getUIPreferences());
    return subscribeUIPreferences(setUiPrefs);
  }, []);

  const appFontSize = `${16 * getTextScale(uiPrefs.textSize)}px`;

  useEffect(() => {
    const handleLogout = () => setLoggedIn(false);
    window.addEventListener('os:auth-logout', handleLogout);
    return () => window.removeEventListener('os:auth-logout', handleLogout);
  }, []);

  return (
    <div style={{ fontSize: appFontSize }}>
      <OSProvider>
        <Desktop />
      </OSProvider>
      {!loggedIn && (
        <div className="fixed inset-0 z-[3000]">
          <LoginScreen onLogin={() => setLoggedIn(true)} wallpaper={wallpaper} />
        </div>
      )}
    </div>
  );
}
