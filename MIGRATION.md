# Migrating agenticos to AspectOS

This document maps every import in the existing agenticos app to its AspectOS equivalent.

## Import Mapping

### Core Services

| Old Import | New Import |
|---|---|
| `import { windowService } from '@/services/WindowService'` | `import { windowManager } from '@aspect/os-core'` |
| `import { WindowState } from '@/services/WindowService'` | `import type { WindowState } from '@aspect/os-core'` |
| `import { appService, OSApp } from '@/services/AppService'` | `import { appRegistry, type AppManifest } from '@aspect/os-core'` |
| `import { eventBus, OS_EVENTS } from '@/services/EventBus'` | `import { eventBus, OS_EVENTS } from '@aspect/os-core'` |
| `import { unifiedEventBus, OS_EVENTS } from '@/services/UnifiedEventBus'` | `import { eventBus, OS_EVENTS } from '@aspect/os-core'` |
| `import { focusManager } from '@/services/FocusManager'` | `import { focusManager } from '@aspect/os-core'` |
| `import { focusStackManager } from '@/services/FocusStackManager'` | `import { focusManager } from '@aspect/os-core'` (combined) |
| `import { screenBoundsService } from '@/services/ScreenBoundsService'` | `import { screenBounds } from '@aspect/os-core'` |
| `import { useOSStore, useOS } from '@/stores/OSStore'` | `import { useOSStore } from '@aspect/os-ui'` |

### UI Components

| Old Import | New Import |
|---|---|
| `import { MacWindow } from '@/components/MacWindow'` | `import { WindowFrame } from '@aspect/os-ui'` |
| `import { WindowRenderer } from '@/components/WindowRenderer'` | `import { WindowRenderer } from '@aspect/os-ui'` |
| `import { MacDesktop } from '@/components/MacDesktop'` | `import { OSDesktop } from '@aspect/os-ui'` |
| `import { DesktopIconsNew } from '@/components/DesktopIconsNew'` | `import { DesktopIconGrid } from '@aspect/os-ui'` |
| `import { MenuBar } from '@/components/menubar/MenuBar'` | `import { SystemMenuBar } from '@aspect/os-ui'` |
| `import { BaseDialog } from '@/components/dialogs/BaseDialog'` | `import { BaseDialog } from '@aspect/os-ui'` |
| `import { FileSaveDialog } from '@/components/dialogs/FileSaveDialog'` | `import { FileDialog } from '@aspect/os-ui'` |
| `import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog'` | `import { ConfirmDialog } from '@aspect/os-ui'` |
| `import { Trash } from '@/components/desktop/Trash'` | `import { TrashIcon } from '@aspect/os-ui'` |

### VFS (Optional Plugin)

| Old Import | New Import |
|---|---|
| `import { vfs } from '@/services/VirtualFileSystem'` | `import { createVFS } from '@aspect/os-vfs'` |
| `import { MemoryAdapter } from '@/services/adapters/MemoryAdapter'` | `import { MemoryAdapter } from '@aspect/os-vfs'` |
| `import { LocalStorageAdapter } from '@/services/adapters/LocalStorageAdapter'` | `import { LocalStorageAdapter } from '@aspect/os-vfs'` |

### Theme / CSS

| Old Import | New Import |
|---|---|
| `@/index.css` (CSS variables) | `@aspect/os-theme/styles.css` |
| `@/styles/modern-components.css` | Included in `@aspect/os-theme/styles.css` |
| CSS class `glass` | CSS class `os-glass` |
| CSS class `glass-window` | CSS class `os-glass-window` |
| CSS variable `--background` | CSS variable `--os-background` |
| CSS variable `--window-bg` | CSS variable `--os-window-bg` |

## Key API Changes

### AppService -> AppRegistry

The `OSApp` interface is now `AppManifest` and no longer includes the `component` field (components are registered in the UI layer, not the core):

```typescript
// Old
appService.registerApp({
  id: 'textedit',
  name: 'TextEdit',
  component: TextEditorComponent,  // React component lived here
  defaultWidth: 600,
  // ...
});

// New: Separate manifest (core) from component (UI)
const manifest: AppManifest = {
  id: 'textedit',
  name: 'TextEdit',
  defaultTitle: 'TextEdit',
  defaultWidth: 600,
  // ... no component here
};

// Components are passed to OSDesktop or WindowRenderer:
<OSDesktop apps={[{ ...manifest, component: TextEditorComponent }]} />
```

### FocusStackManager -> FocusManager

The separate FocusManager and FocusStackManager are now combined:

```typescript
// Old
focusStackManager.pushApp(appId);
focusStackManager.activateFinder();
focusManager.setActiveWindow(windowId);

// New (single FocusManager)
focusManager.pushApp(appId);
focusManager.activateDesktop();
focusManager.setActiveWindow(windowId);
```

## What Stays in the Consumer App

These things are **not** part of AspectOS and remain in agenticos:

- Supabase client, auth, and storage
- SupabaseStorageAdapter (implement the `StorageAdapter` interface from @aspect/os-vfs)
- FolderBasedFileSystem (Supabase-specific)
- All app implementations (Terminal, Paint, PhotoEditor, etc.)
- AI/orchestration services
- Notes, RAG, and domain-specific services
- Voice call, Spline integration, game logic
- User authentication flow
