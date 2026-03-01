import { createContext, useContext, type ReactNode } from 'react';
import type { OSStoreState } from '@aspect/os-core';
import { useStore, type StoreApi } from 'zustand';

type OSStoreInstance = StoreApi<OSStoreState>;

const OSStoreContext = createContext<OSStoreInstance | null>(null);

export interface OSStoreProviderProps {
  store: OSStoreInstance;
  children: ReactNode;
}

export function OSStoreProvider({ store, children }: OSStoreProviderProps) {
  return (
    <OSStoreContext.Provider value={store}>{children}</OSStoreContext.Provider>
  );
}

export function useOSStore<T>(selector: (state: OSStoreState) => T): T {
  const store = useContext(OSStoreContext);
  if (!store) {
    throw new Error('useOSStore must be used within an <OSStoreProvider>');
  }
  return useStore(store, selector);
}
