import './index.css';
import { useState, useMemo, useEffect } from 'react';
import {
  OSProvider,
  OSDesktop,
  SystemMenuBar,
  SystemTray,
  WindowRenderer,
  useOSServices,
} from '@aspect/os-ui';
import { MessageCircle, FileText, Settings, Terminal, LayoutGrid } from 'lucide-react';
import { ChatApp } from './apps/ChatApp';
import { NotepadApp } from './apps/NotepadApp';
import { PreferencesApp } from './apps/PreferencesApp';
import { TerminalApp } from './apps/TerminalApp';
import { ComponentShowcase } from './apps/ComponentShowcase';
import { LoginScreen } from './components/LoginScreen';

const WALLPAPER =
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)';

function AppIcon({ icon: Icon }: { icon: React.ComponentType<any> }) {
  return <Icon className="w-9 h-9 text-white drop-shadow-lg" strokeWidth={1.5} />;
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

function useDarkModeInit() {
  useEffect(() => {
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
  const { windowManager } = useOSServices();

  const componentMap = useMemo(() => {
    const map = new Map<string, React.ComponentType<any>>();
    for (const app of appDefinitions) map.set(app.id, app.component);
    return map;
  }, []);

  return (
    <OSDesktop wallpaper={WALLPAPER} apps={appDefinitions}>
      <WindowRenderer
        appComponentMap={componentMap}
        onWindowFocus={(id) => windowManager.focusWindow(id)}
        onWindowClose={(id) => windowManager.closeWindow(id)}
        onWindowMove={(id, x, y) => windowManager.updateWindow(id, { x, y })}
        onWindowResize={(id, w, h) =>
          windowManager.updateWindow(id, { width: w, height: h })
        }
        onWindowMinimize={(id) => windowManager.minimizeWindow(id)}
        onWindowMaximize={(id) => windowManager.maximizeWindow(id)}
      />
    </OSDesktop>
  );
}

export default function App() {
  useDarkModeInit();
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} wallpaper={WALLPAPER} />;
  }

  return (
    <OSProvider>
      <SystemMenuBar activeAppName="Finder" rightContent={<SystemTray />} />
      <Desktop />
    </OSProvider>
  );
}
