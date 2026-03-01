# AspectOS Agent Quickstart

This guide is for AI/agentic developers (Claude Code, Codex, etc.) to make safe, fast changes in `aspect-os`.

## 1) Where to start

- Demo entry: `apps/demo/src/App.tsx`
- Demo apps: `apps/demo/src/apps/`
- Core window logic: `packages/core/src/WindowManager.ts`
- Screen constraints: `packages/core/src/ScreenBounds.ts`
- Window UI/chrome: `packages/ui/src/components/window/`
- Desktop UI/icons/trash: `packages/ui/src/components/desktop/`
- Human guide: `docs/GUIDE.md`

## 2) Typical task map

- **Window behavior bug** (drag/resize/min/max/focus):
  - Update state logic in `packages/core/src/WindowManager.ts`
  - Update frame/interactions in `packages/ui/src/components/window/WindowFrame.tsx`
- **Desktop visuals** (wallpaper, icons, trash):
  - Demo wiring in `apps/demo/src/App.tsx`
  - Preference UI in `apps/demo/src/apps/PreferencesApp.tsx`
  - Shared desktop UI in `packages/ui/src/components/desktop/`
- **App-level features** (Messages/Terminal/Notes/etc.):
  - Edit corresponding file in `apps/demo/src/apps/`
- **Preferences propagation** (text/interface scale, wallpaper):
  - Demo preference modules in `apps/demo/src/`
  - Apply effects in `apps/demo/src/App.tsx`

## 3) Demo app architecture notes

- `OSProvider` creates and shares services (window manager, app registry, event bus, focus manager).
- `OSDesktop` renders wallpaper + icons.
- `WindowRenderer` renders app windows using data from core store/services.
- Demo-specific state (e.g. wallpaper preference) lives in `apps/demo/src`.

## 4) Safe change checklist

1. Keep core behavior in `packages/core` and presentation in `packages/ui`.
2. If changing maximize/minimize, verify both green button and title-bar double-click paths.
3. Preserve keyboard/window accessibility semantics (`role`, focus behavior, escape/cmd+w handlers).
4. Build before claiming done:
   - `npm run build`
   - `npm run typecheck`

## 5) Fast verification scenarios

- Open 2 windows, drag/resize each, ensure no visual flicker.
- Maximize then restore from green button and title-bar double-click.
- Change wallpaper in Preferences and confirm immediate desktop update.
- Upload and drag/drop image in Preferences wallpaper section.
- Open Terminal and verify prompt spacing.
- From Preferences -> Appearance, change interface/text size and verify desktop icon size + text scale update.
- From menu bar:
  - Notes app -> File -> New Note should open a blank Notes window.
  - Terminal app -> Shell -> New Tab should add a tab in the active terminal window.

## 6) Common pitfalls

- Applying window constraints during maximize can unintentionally add margins.
- Tying open animation to every render/class change can cause drag flicker.
- Editing only templates without wiring app-specific surfaces means users won’t see changes.
