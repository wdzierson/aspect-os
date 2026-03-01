import { useEffect, useRef, type ReactNode } from 'react';
import {
  createOSStore,
  createWindowManager,
  createAppRegistry,
  createEventBus,
  createFocusManager,
  createScreenBounds,
  type OSConfig,
} from '@aspect/os-core';
import { OSStoreProvider } from '../store/OSStoreContext';

export interface OSProviderProps {
  children: ReactNode;
  config?: OSConfig;
}

interface OSServices {
  store: ReturnType<typeof createOSStore>;
  eventBus: ReturnType<typeof createEventBus>;
  screenBounds: ReturnType<typeof createScreenBounds>;
  windowManager: ReturnType<typeof createWindowManager>;
  appRegistry: ReturnType<typeof createAppRegistry>;
  focusManager: ReturnType<typeof createFocusManager>;
}

function initServices(config?: OSConfig): OSServices {
  const store = createOSStore();
  const eventBus = createEventBus();
  const screenBounds = createScreenBounds(config);
  const windowManager = createWindowManager(screenBounds);
  const appRegistry = createAppRegistry(windowManager, eventBus, screenBounds);
  const focusManager = createFocusManager(eventBus);

  windowManager.subscribe('os-provider', (windows) => {
    store.getState().setWindows(windows);
  });

  return { store, eventBus, screenBounds, windowManager, appRegistry, focusManager };
}

export function OSProvider({ children, config }: OSProviderProps) {
  const servicesRef = useRef<OSServices | null>(null);

  if (!servicesRef.current) {
    servicesRef.current = initServices(config);
  }

  const { store } = servicesRef.current;

  useEffect(() => {
    store.getState().setInitialized(true);
    return () => {
      store.getState().setInitialized(false);
    };
  }, [store]);

  return (
    <OSStoreProvider store={store}>
      {children}
    </OSStoreProvider>
  );
}
