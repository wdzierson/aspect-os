import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { WindowState, AppManifest } from '../types';

export interface OSStoreUI {
  activeWindow: string | null;
  selectedFiles: string[];
  focusedApp: string | null;
  isInitialized: boolean;
  isLoading: boolean;
}

export interface OSStoreState {
  windows: Map<string, WindowState>;
  apps: AppManifest[];
  ui: OSStoreUI;

  setWindows(windows: Map<string, WindowState>): void;
  updateWindow(id: string, updates: Partial<WindowState>): void;
  removeWindow(id: string): void;

  setApps(apps: AppManifest[]): void;
  addApp(app: AppManifest): void;

  setActiveWindow(windowId: string | null): void;
  setSelectedFiles(filenames: string[]): void;
  setFocusedApp(appId: string | null): void;
  setInitialized(initialized: boolean): void;
  setLoading(loading: boolean): void;
}

export type OSStore = ReturnType<typeof createOSStore>;

export function createOSStore() {
  return create<OSStoreState>()(
    subscribeWithSelector((set) => ({
      windows: new Map<string, WindowState>(),
      apps: [],
      ui: {
        activeWindow: null,
        selectedFiles: [],
        focusedApp: null,
        isInitialized: false,
        isLoading: false,
      },

      setWindows(windows) {
        set({ windows: new Map(windows) });
      },
      updateWindow(id, updates) {
        set((state) => {
          const win = state.windows.get(id);
          if (!win) return state;
          const next = new Map(state.windows);
          next.set(id, { ...win, ...updates });
          return { windows: next };
        });
      },
      removeWindow(id) {
        set((state) => {
          const next = new Map(state.windows);
          next.delete(id);
          return { windows: next };
        });
      },
      setApps(apps) {
        set({ apps });
      },
      addApp(app) {
        set((state) => ({ apps: [...state.apps, app] }));
      },
      setActiveWindow(windowId) {
        set((state) => ({ ui: { ...state.ui, activeWindow: windowId } }));
      },
      setSelectedFiles(filenames) {
        set((state) => ({ ui: { ...state.ui, selectedFiles: filenames } }));
      },
      setFocusedApp(appId) {
        set((state) => ({ ui: { ...state.ui, focusedApp: appId } }));
      },
      setInitialized(initialized) {
        set((state) => ({ ui: { ...state.ui, isInitialized: initialized } }));
      },
      setLoading(loading) {
        set((state) => ({ ui: { ...state.ui, isLoading: loading } }));
      },
    })),
  );
}

export type UseOSStore = ReturnType<typeof createOSStore>;
