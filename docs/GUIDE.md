# AspectOS Developer Guide

Build OS-like windowed desktop experiences in the browser with React.

---

## Installation

```bash
git clone https://github.com/wdzierson/aspect-os.git
cd aspect-os
npm install
npm run build
```

To run the demo:

```bash
npm run dev
# Opens at http://localhost:5173
```

---

## Quick Start: Your First Desktop in 30 Lines

```tsx
// App.tsx
import { OSProvider, OSDesktop, SystemMenuBar, SystemTray, WindowRenderer, useOSServices } from '@aspect/os-ui';
import '@aspect/os-theme/styles.css';

function MyApp() {
  return (
    <div style={{ padding: 20, color: '#333' }}>
      <h2>Hello from my app!</h2>
      <p>This is running inside an OS window.</p>
    </div>
  );
}

const apps = [{
  id: 'my-app',
  name: 'My App',
  icon: '🚀',
  defaultTitle: 'My App',
  defaultWidth: 500,
  defaultHeight: 350,
  component: MyApp,
}];

function Desktop() {
  const { windowManager } = useOSServices();
  const componentMap = new Map([['my-app', MyApp]]);

  return (
    <OSDesktop wallpaper="linear-gradient(135deg, #667eea, #764ba2)" apps={apps}>
      <WindowRenderer
        appComponentMap={componentMap}
        onWindowFocus={(id) => windowManager.focusWindow(id)}
        onWindowClose={(id) => windowManager.closeWindow(id)}
        onWindowMove={(id, x, y) => windowManager.updateWindow(id, { x, y })}
        onWindowResize={(id, w, h) => windowManager.updateWindow(id, { width: w, height: h })}
        onWindowMinimize={(id) => windowManager.minimizeWindow(id)}
        onWindowMaximize={(id) => windowManager.maximizeWindow(id)}
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
```

---

## Core Concepts

### 1. OSProvider — The Kernel

`<OSProvider>` is the root. It creates all OS services and wires them together:

- **WindowManager** — tracks window positions, sizes, z-index, minimize/maximize state
- **AppRegistry** — stores app manifests, handles launch/close lifecycle
- **EventBus** — pub/sub for OS events (window opened, app launched, menu action, etc.)
- **FocusManager** — tracks which window is active, manages the app focus stack
- **ScreenBounds** — safe positioning, cascade offsets, screen resize handling

```tsx
<OSProvider config={{ menuBarHeight: 32, windowMargin: 24 }}>
  {/* Your desktop goes here */}
</OSProvider>
```

### 2. useOSServices — Accessing Services

Any component inside `<OSProvider>` can access the OS services:

```tsx
import { useOSServices } from '@aspect/os-ui';

function MyComponent() {
  const { windowManager, appRegistry, eventBus, focusManager } = useOSServices();

  // Launch an app programmatically
  const openSettings = () => appRegistry.launchApp('settings');

  // Listen for events
  useEffect(() => {
    return eventBus.on('window:opened', (event) => {
      console.log('Window opened:', event.data.windowId);
    });
  }, [eventBus]);
}
```

### 3. useOSStore — Reactive State

Read the Zustand store for reactive UI updates:

```tsx
import { useOSStore } from '@aspect/os-ui';

function WindowCount() {
  const windows = useOSStore((s) => s.windows);
  return <span>{windows.size} windows open</span>;
}
```

---

## Registering Apps

Apps are defined as manifests + React components:

```tsx
import { MessageCircle } from 'lucide-react';

const apps = [
  {
    id: 'chat',                    // Unique identifier
    name: 'Messages',             // Display name for desktop icon
    icon: <MessageCircle className="w-9 h-9 text-white" strokeWidth={1.5} />,
    defaultTitle: 'Messages',     // Window title bar text
    defaultWidth: 680,            // Initial window width
    defaultHeight: 500,           // Initial window height
    preferredPosition: 'cascade', // 'cascade' | 'center' | 'top-left' | 'top-right' | etc.
    hidden: false,                // If true, won't show on desktop
    component: ChatApp,           // Your React component
  },
];
```

The `icon` field can be:
- A **string** (emoji): `'📝'`
- A **ReactNode** (lucide-react, SVG, etc.): `<FileText className="w-9 h-9 text-white" />`

### App Component Props

Every app component receives a `context` prop:

```tsx
import type { AppContext } from '@aspect/os-core';

function MyApp({ context }: { context: AppContext }) {
  // context.windowId — the unique window instance ID
  // context.windowState — current position, size, focus state
  // context.metadata — any data passed via launchApp options
  return <div>...</div>;
}
```

---

## Window Management

### Programmatic Window Control

```tsx
const { windowManager, appRegistry } = useOSServices();

// Launch a new window
const windowId = appRegistry.launchApp('my-app', undefined, { file: 'readme.txt' });

// Move a window
windowManager.updateWindow(windowId, { x: 100, y: 200 });

// Resize
windowManager.updateWindow(windowId, { width: 800, height: 600 });

// Minimize / Restore / Maximize
windowManager.minimizeWindow(windowId);
windowManager.restoreWindow(windowId);
windowManager.maximizeWindow(windowId);

// Focus (bring to front)
windowManager.focusWindow(windowId);

// Close
windowManager.closeWindow(windowId);
// — or —
appRegistry.closeApp(windowId); // Also cleans up running app tracking
```

### Window Behavior

- **Drag**: Click and drag the title bar. Windows are constrained to screen bounds.
- **Resize**: Drag the right edge, bottom edge, or bottom-right corner.
- **Traffic lights**: Red = close, Yellow = minimize, Green = maximize.
- **Focus**: Click anywhere in a window to bring it to front.
- **Keyboard**: Escape or Cmd+W closes the focused window.
- **Error isolation**: Each window has an error boundary — one app crashing doesn't take down the OS.

---

## Menu Bar

The menu bar is separate from the desktop and sits at the top:

```tsx
<SystemMenuBar
  activeAppName="Messages"            // Bold app name shown in menu bar
  activeAppId="chat"                  // Used to look up app-specific menus
  appleMenuItems={[                   // Override the Apple menu items
    { label: 'About AspectOS', action: 'about' },
    { separator: true },
    { label: 'Preferences...', action: 'preferences', shortcut: '⌘,' },
    { separator: true },
    { label: 'Quit', action: 'quit', shortcut: '⌘Q' },
  ]}
  appMenus={{                         // Per-app menu definitions
    chat: [
      [
        { label: 'New Conversation', action: 'new', shortcut: '⌘N' },
        { label: 'Close', action: 'close', shortcut: '⌘W' },
      ],
      [
        { label: 'Select All', action: 'select-all', shortcut: '⌘A' },
      ],
    ],
  }}
  rightContent={<SystemTray />}       // Right side of the menu bar
/>
```

### Listening for Menu Actions

```tsx
useEffect(() => {
  const handler = (e: CustomEvent) => {
    const { action, appId } = e.detail;
    if (action === 'new' && appId === 'chat') {
      // Handle "New Conversation"
    }
  };
  window.addEventListener('os:menu-action', handler);
  return () => window.removeEventListener('os:menu-action', handler);
}, []);
```

---

## Dialogs

```tsx
import { FileDialog, AlertDialog, ConfirmDialog } from '@aspect/os-ui';

// File save dialog
<FileDialog
  isOpen={showSave}
  onClose={() => setShowSave(false)}
  onSave={(filename, location) => handleSave(filename, location)}
  defaultFilename="untitled.txt"
  title="Save As"
/>

// Alert dialog
<AlertDialog
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  onConfirm={() => handleConfirm()}
  title="Delete File"
  message="Are you sure you want to delete this file? This cannot be undone."
  confirmLabel="Delete"
  variant="destructive"
/>

// Confirm dialog
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={() => handleAction()}
  title="Send Message"
  message="Send this message to all contacts?"
/>
```

---

## Notifications

```tsx
import { NotificationCenter } from '@aspect/os-ui';

const [notifications, setNotifications] = useState([]);

// Add a notification
setNotifications(prev => [...prev, {
  id: Date.now().toString(),
  title: 'New Message',
  message: 'Alice sent you a message',
  duration: 5000, // auto-dismiss after 5s
  actions: [{ label: 'Reply', onClick: () => openChat('alice'), variant: 'primary' }],
}]);

// Render
<NotificationCenter
  notifications={notifications}
  onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
/>
```

---

## Theming

### Tailwind Preset

Add the AspectOS preset to your `tailwind.config.ts`:

```typescript
import { aspectOSPreset } from '@aspect/os-theme/preset';

export default {
  presets: [aspectOSPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@aspect/os-ui/src/**/*.{ts,tsx}',  // Scan UI package
  ],
};
```

### CSS Variables

Import the theme stylesheet:

```css
@import '@aspect/os-theme/styles.css';
```

All tokens use the `--os-` prefix:

```css
.my-panel {
  background: hsl(var(--os-glass-bg));
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--os-glass-border));
  border-radius: var(--os-radius-lg);
  box-shadow: var(--os-shadow-floating);
}
```

### Dark Mode

Add the `dark` class to `<html>` or a parent element:

```html
<html class="dark">
```

All `--os-*` variables automatically switch to dark values.

---

## Event Bus

The event bus lets you build cross-app communication:

```tsx
const { eventBus } = useOSServices();

// Standard OS events
eventBus.on('window:opened', (e) => { /* ... */ });
eventBus.on('window:closed', (e) => { /* ... */ });
eventBus.on('window:focused', (e) => { /* ... */ });
eventBus.on('app:launched', (e) => { /* appId, windowId */ });
eventBus.on('app:quit', (e) => { /* ... */ });
eventBus.on('focus:active_app_changed', (e) => { /* appId */ });
eventBus.on('menu:action', (e) => { /* action, appId */ });

// Custom events
eventBus.emit('chat:new-message', { from: 'alice', text: 'Hello!' }, 'ChatApp');
eventBus.on('chat:new-message', (e) => showNotification(e.data));
```

---

## Virtual File System (Optional)

Install the VFS plugin for file persistence:

```tsx
import { VirtualFileSystem, MemoryAdapter, LocalStorageAdapter, VFSProvider, useVFS } from '@aspect/os-vfs';

// Create a VFS with localStorage persistence
const vfs = new VirtualFileSystem({ defaultUsername: 'user' });
vfs.registerAdapter('storage', new LocalStorageAdapter('myapp_'));
vfs.mount('/', 'storage');
await vfs.initializeAfterMount();

// Provide to the tree
<VFSProvider value={vfs}>
  <App />
</VFSProvider>

// Use in components
function MyEditor() {
  const vfs = useVFS();

  const save = async (content: string) => {
    await vfs.write('/Users/user/Documents/note.txt', content, 'text/plain');
  };

  const load = async () => {
    const node = await vfs.read('/Users/user/Documents/note.txt');
    return node?.content ?? '';
  };
}
```

### Custom Storage Adapter

Implement the `StorageAdapter` interface to connect any backend:

```typescript
import type { StorageAdapter, VFSNode } from '@aspect/os-vfs';

class SupabaseAdapter implements StorageAdapter {
  async read(path: string): Promise<VFSNode | null> { /* ... */ }
  async write(path: string, node: VFSNode): Promise<void> { /* ... */ }
  async delete(path: string): Promise<void> { /* ... */ }
  async list(path: string): Promise<string[]> { /* ... */ }
  async exists(path: string): Promise<boolean> { /* ... */ }
  async mkdir(path: string): Promise<void> { /* ... */ }
}
```

---

## Integrating with Existing Apps (e.g., agenticos)

To migrate an existing app to use AspectOS as its presentation layer:

### 1. Install the packages

```bash
npm install @aspect/os-core @aspect/os-ui @aspect/os-theme
```

### 2. Replace the desktop shell

```tsx
// Before (agenticos inline)
import { MacDesktop } from '@/components/MacDesktop';

// After (AspectOS library)
import { OSProvider, OSDesktop, SystemMenuBar, SystemTray, WindowRenderer, useOSServices } from '@aspect/os-ui';
import '@aspect/os-theme/styles.css';
```

### 3. Register your apps

```tsx
const apps = [
  { id: 'terminal', name: 'Terminal', icon: <Terminal />, component: TerminalApp, ... },
  { id: 'textedit', name: 'TextEdit', icon: <FileText />, component: TextEditApp, ... },
  { id: 'paint', name: 'Paint', icon: <Paintbrush />, component: PaintApp, ... },
  // ... all your apps
];
```

### 4. Keep your business logic

Supabase auth, storage adapters, AI services, and all domain logic stay in your app. AspectOS only handles the windowed desktop UI layer.

### Import Mapping Reference

| agenticos | AspectOS |
|---|---|
| `windowService` | `useOSServices().windowManager` |
| `appService` | `useOSServices().appRegistry` |
| `eventBus` / `unifiedEventBus` | `useOSServices().eventBus` |
| `focusManager` + `focusStackManager` | `useOSServices().focusManager` |
| `screenBoundsService` | `useOSServices().screenBounds` |
| `useOSStore` / `useOS` | `useOSStore` from `@aspect/os-ui` |
| `MacWindow` | `WindowFrame` |
| `MacDesktop` | `OSDesktop` |
| `MenuBar` | `SystemMenuBar` |
| `FileSaveDialog` | `FileDialog` |
| `DeleteConfirmDialog` | `ConfirmDialog` |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│  <OSProvider>                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Services (created once, shared via context)    │ │
│  │  ├── WindowManager    ← window CRUD + z-index  │ │
│  │  ├── AppRegistry      ← manifest + lifecycle   │ │
│  │  ├── EventBus         ← pub/sub                │ │
│  │  ├── FocusManager     ← active window + stack  │ │
│  │  └── ScreenBounds     ← safe positioning       │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌───────────────────┐ ┌──────────────────────────┐ │
│  │  <SystemMenuBar>  │ │  <OSDesktop>             │ │
│  │  Apple | App | ☰  │ │  ┌────────────────────┐  │ │
│  └───────────────────┘ │  │ <DesktopIconGrid>  │  │ │
│                        │  │  📝 💬 ⚙️            │  │ │
│                        │  └────────────────────┘  │ │
│                        │  ┌────────────────────┐  │ │
│                        │  │ <WindowRenderer>   │  │ │
│                        │  │  ┌──────────────┐  │  │ │
│                        │  │  │ WindowFrame  │  │  │ │
│                        │  │  │ ┌──────────┐ │  │  │ │
│                        │  │  │ │ Your App │ │  │  │ │
│                        │  │  │ └──────────┘ │  │  │ │
│                        │  │  └──────────────┘  │  │ │
│                        │  └────────────────────┘  │ │
│                        └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```
