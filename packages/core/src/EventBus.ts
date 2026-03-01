import type { OSEvent, EventCallback } from './types';

export const OS_EVENTS = {
  FILE_OPENED: 'file:opened',
  FILE_SAVED: 'file:saved',
  FILE_DELETED: 'file:deleted',
  FILE_CREATED: 'file:created',
  FILE_MODIFIED: 'file:modified',

  WINDOW_OPENED: 'window:opened',
  WINDOW_CLOSED: 'window:closed',
  WINDOW_FOCUSED: 'window:focused',
  WINDOW_MINIMIZED: 'window:minimized',
  WINDOW_MAXIMIZED: 'window:maximized',
  WINDOW_RESIZED: 'window:resized',
  WINDOW_MOVED: 'window:moved',

  APP_LAUNCHED: 'app:launched',
  APP_QUIT: 'app:quit',
  APP_REGISTERED: 'app:registered',

  DESKTOP_FOCUSED: 'desktop:focused',
  MENU_ACTION: 'menu:action',

  ACTIVE_APP_CHANGED: 'focus:active_app_changed',
  FOCUS_CHANGED: 'focus:changed',
} as const;

export type OSEventType = (typeof OS_EVENTS)[keyof typeof OS_EVENTS];

export class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const idx = callbacks.indexOf(callback);
      if (idx >= 0) callbacks.splice(idx, 1);
    }
  }

  emit(type: string, data?: any, source?: string): void {
    const event: OSEvent = { type, data, timestamp: Date.now(), source };
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try { cb(event); } catch { /* swallow to prevent cascade */ }
      });
    }
  }

  removeAllListeners(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  waitForEvent(eventType: string, timeout = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        unsub();
        reject(new Error(`Event ${eventType} timed out after ${timeout}ms`));
      }, timeout);

      const unsub = this.on(eventType, (event) => {
        clearTimeout(timer);
        unsub();
        resolve(event.data);
      });
    });
  }
}

export function createEventBus(): EventBus {
  return new EventBus();
}

export const eventBus = createEventBus();
