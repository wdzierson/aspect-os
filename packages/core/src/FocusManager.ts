import type { FocusState } from './types';
import type { EventBus } from './EventBus';
import { eventBus as defaultEB, OS_EVENTS } from './EventBus';

export interface FocusCallbacks {
  onFocus: () => void;
  onBlur: () => void;
}

export class FocusManager {
  private state: FocusState = { activeWindowId: null, previousWindowId: null };
  private windowCallbacks = new Map<string, FocusCallbacks>();
  private listeners = new Set<(state: FocusState) => void>();
  private focusStack: string[] = [];
  private eb: EventBus;

  constructor(eb?: EventBus) {
    this.eb = eb ?? defaultEB;
  }

  registerWindow(windowId: string, callbacks: FocusCallbacks): void {
    this.windowCallbacks.set(windowId, callbacks);
  }

  unregisterWindow(windowId: string): void {
    this.windowCallbacks.delete(windowId);
    if (this.state.activeWindowId === windowId) this.setActiveWindow(null);
  }

  setActiveWindow(windowId: string | null): void {
    const prev = this.state.activeWindowId;
    if (prev) this.windowCallbacks.get(prev)?.onBlur();
    this.state = { activeWindowId: windowId, previousWindowId: prev };
    if (windowId) this.windowCallbacks.get(windowId)?.onFocus();
    this.listeners.forEach((cb) => cb(this.state));
  }

  getFocusState(): FocusState {
    return { ...this.state };
  }

  isWindowActive(windowId: string): boolean {
    return this.state.activeWindowId === windowId;
  }

  subscribe(callback: (state: FocusState) => void): () => void {
    this.listeners.add(callback);
    return () => { this.listeners.delete(callback); };
  }

  // App focus stack

  getActiveApp(): string {
    return this.focusStack.length > 0 ? this.focusStack[this.focusStack.length - 1] : 'finder';
  }

  pushApp(appId: string): void {
    if (!appId || appId === 'finder') {
      this.activateDesktop();
      return;
    }
    this.focusStack = this.focusStack.filter((id) => id !== appId);
    this.focusStack.push(appId);
    this.eb.emit(OS_EVENTS.ACTIVE_APP_CHANGED, { appId }, 'FocusManager');
  }

  removeApp(appId: string): void {
    const idx = this.focusStack.indexOf(appId);
    if (idx !== -1) {
      this.focusStack.splice(idx, 1);
      this.eb.emit(OS_EVENTS.ACTIVE_APP_CHANGED, { appId: this.getActiveApp() }, 'FocusManager');
    }
  }

  activateDesktop(): void {
    this.focusStack = [];
    this.eb.emit(OS_EVENTS.ACTIVE_APP_CHANGED, { appId: 'finder' }, 'FocusManager');
  }

  getStack(): string[] {
    return [...this.focusStack];
  }
}

export function createFocusManager(eb?: EventBus): FocusManager {
  return new FocusManager(eb);
}

export const focusManager = createFocusManager();
