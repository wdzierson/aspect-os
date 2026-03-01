# AspectOS

A reusable, macOS-style windowed OS experience as a React component library.

## Documentation

- Human developer guide: `docs/GUIDE.md`
- AI/agentic quickstart: `docs/AGENTS.md`

## Quick Start

```tsx
import { OSProvider, OSDesktop, SystemMenuBar, SystemTray } from '@aspect/os-ui';
import '@aspect/os-theme/styles.css';

function MyApp({ context }) {
  return <div>Your app content here</div>;
}

function App() {
  return (
    <OSProvider>
      <SystemMenuBar activeAppName="Finder" rightContent={<SystemTray />} />
      <OSDesktop
        wallpaper="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        apps={[{
          id: 'my-app',
          name: 'My App',
          icon: '🚀',
          defaultTitle: 'My App',
          defaultWidth: 600,
          defaultHeight: 400,
          component: MyApp,
        }]}
      />
    </OSProvider>
  );
}
```

## Packages

| Package | Description | Size |
| --- | --- | --- |
| `@aspect/os-core` | Headless OS primitives: window manager, app registry, event bus, focus manager | 17 KB |
| `@aspect/os-ui` | React components: windows, desktop, menu bar, dialogs, notifications | 62 KB |
| `@aspect/os-theme` | Design tokens, CSS variables, Tailwind preset, glassmorphism | 6 KB |
| `@aspect/os-vfs` | Optional virtual file system with adapter-based storage | 15 KB |

## Architecture

```text
@aspect/os-core (headless)
├── WindowManager — window state, position, z-index, resize, minimize/maximize
├── AppRegistry — app manifests, launch/close lifecycle, running app tracking
├── EventBus — pub/sub for OS events (window opened, app launched, menu action, etc.)
├── FocusManager — window focus + app focus stack
├── ScreenBounds — safe positioning, cascade, corner placement, screen resize
└── createOSStore — Zustand store factory for reactive state

@aspect/os-ui (React)
├── Window: WindowFrame, TitleBar, TrafficLights, ResizeHandles, WindowRenderer
├── Desktop: OSDesktop, DesktopSurface, DesktopIconGrid, DesktopIcon, TrashIcon
├── MenuBar: SystemMenuBar, AppleMenu, AppMenus, SystemTray, ClockWidget
├── Dialogs: BaseDialog, FileDialog, AlertDialog, ConfirmDialog
├── Notifications: NotificationCenter, DesktopNotification
└── OSProvider — wires everything together

@aspect/os-theme (CSS + Tailwind)
├── styles.css — CSS custom properties (--os-*), glass morphism, scrollbars
├── tailwind-preset — Tailwind preset with all OS tokens mapped
└── tokens — TypeScript exports for programmatic access

@aspect/os-vfs (optional plugin)
├── VirtualFileSystem — adapter-based VFS with mount points
├── MemoryAdapter — in-memory storage
└── LocalStorageAdapter — browser localStorage persistence
```

## Development

```bash
npm install
npm run build    # Build all packages
npm run dev      # Watch mode for all packages
```

### Demo App

```bash
cd apps/demo
npm run dev      # Start the demo at http://localhost:5173
```

## Tailwind Setup

Add the AspectOS preset to your `tailwind.config.ts`:

```typescript
import { aspectOSPreset } from '@aspect/os-theme/preset';

export default {
  presets: [aspectOSPreset],
  content: ['./src/**/*.{ts,tsx}'],
};
```

## Design Tokens

All tokens use the `--os-` CSS variable prefix. Key categories:

- **Colors**: `--os-background`, `--os-foreground`, `--os-primary`, `--os-mac-red/yellow/green`, `--os-window-*`, `--os-glass-*`
- **Spacing**: 4px grid (`--os-space-1` through `--os-space-16`)
- **Radius**: `--os-radius-sm` (8px), `--os-radius` (10px), `--os-radius-lg` (16px)
- **Shadows**: `--os-shadow-window`, `--os-shadow-floating`, `--os-shadow-sm/md/lg/xl`
- **Glass**: `--os-blur-sm/md/lg/xl`, `--os-glass-bg/border/shadow`
- **Animation**: `--os-duration-fast` (150ms), `--os-duration-normal` (250ms), `--os-duration-slow` (350ms)

## Accessibility

WCAG 2.1 AA compliant:

- All interactive elements have `aria-label` attributes
- Keyboard navigation: Tab through windows, Escape to close, Cmd+W to close active window
- Focus management with `aria-live` regions for screen reader announcements
- `prefers-reduced-motion` support disables all animations
- Semantic roles: `role="application"` on desktop, `role="alertdialog"` on alerts

## License

MIT
