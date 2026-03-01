import type { WindowState } from './types';
import type { ScreenBoundsManager } from './ScreenBounds';
import { screenBounds as defaultScreenBounds } from './ScreenBounds';

export class WindowManager {
  private windows = new Map<string, WindowState>();
  private listeners = new Map<string, (windows: Map<string, WindowState>) => void>();
  private highestZIndex = 100;
  private screenBounds: ScreenBoundsManager;

  constructor(sb?: ScreenBoundsManager) {
    this.screenBounds = sb ?? defaultScreenBounds;
  }

  createWindow(state: WindowState): WindowState {
    const safe = this.screenBounds.constrainPosition(state.x, state.y, state.width, state.height);
    const win: WindowState = { ...state, x: safe.x, y: safe.y, zIndex: ++this.highestZIndex };
    this.windows.set(win.id, win);
    this.notify();
    return win;
  }

  getWindow(id: string): WindowState | null {
    return this.windows.get(id) ?? null;
  }

  getAllWindows(): WindowState[] {
    return Array.from(this.windows.values());
  }

  getAllWindowsMap(): Map<string, WindowState> {
    return new Map(this.windows);
  }

  updateWindow(id: string, updates: Partial<WindowState>): void {
    const win = this.windows.get(id);
    if (!win) return;

    let final = { ...updates };
    if ('x' in updates || 'y' in updates || 'width' in updates || 'height' in updates) {
      const pos = this.screenBounds.constrainPosition(
        updates.x ?? win.x,
        updates.y ?? win.y,
        updates.width ?? win.width,
        updates.height ?? win.height,
      );
      final = { ...final, x: pos.x, y: pos.y };
    }
    this.windows.set(id, { ...win, ...final });
    this.notify();
  }

  focusWindow(id: string): void {
    const win = this.windows.get(id);
    if (win && !win.isMinimized) {
      this.windows.forEach((w, wid) => {
        if (w.isFocused && wid !== id) {
          this.windows.set(wid, { ...w, isFocused: false });
        }
      });
      this.windows.set(id, { ...win, zIndex: ++this.highestZIndex, isFocused: true });
      this.notify();
    }
  }

  closeWindow(id: string): void {
    if (this.windows.delete(id)) this.notify();
  }

  minimizeWindow(id: string): void {
    this.updateWindow(id, { isMinimized: true, isFocused: false });
  }

  restoreWindow(id: string): void {
    this.updateWindow(id, { isMinimized: false, isMaximized: false });
    this.focusWindow(id);
  }

  maximizeWindow(id: string): void {
    const b = this.screenBounds.getBounds();
    this.updateWindow(id, {
      isMaximized: true,
      isMinimized: false,
      x: b.minMargin,
      y: b.menuBarHeight + b.minMargin,
      width: b.width - b.minMargin * 2,
      height: b.height - b.menuBarHeight - b.minMargin * 2,
    });
  }

  validateAndFixAllWindows(): void {
    let changed = false;
    this.windows.forEach((win, id) => {
      if (this.screenBounds.isWindowOffScreen(win.x, win.y, win.width, win.height)) {
        const pos = this.screenBounds.constrainPosition(win.x, win.y, win.width, win.height);
        this.windows.set(id, { ...win, x: pos.x, y: pos.y });
        changed = true;
      }
    });
    if (changed) this.notify();
  }

  subscribe(id: string, callback: (windows: Map<string, WindowState>) => void): void {
    this.listeners.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  private notify(): void {
    const snapshot = this.getAllWindowsMap();
    this.listeners.forEach((cb) => cb(snapshot));
  }
}

export function createWindowManager(sb?: ScreenBoundsManager): WindowManager {
  return new WindowManager(sb);
}

export const windowManager = createWindowManager();
