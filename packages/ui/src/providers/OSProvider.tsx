import { useEffect, useRef, type ReactNode } from 'react';
import {
  createOSStore,
  createWindowManager,
  createAppRegistry,
  createEventBus,
  createFocusManager,
  createScreenBounds,
  OS_EVENTS,
  type OSConfig,
} from '@aspect/os-core';
import { OSStoreProvider } from '../store/OSStoreContext';
import { OSServicesProvider, type OSServices } from '../store/OSServicesContext';

export interface OSProviderProps {
  children: ReactNode;
  config?: OSConfig;
}

function initServices(config?: OSConfig) {
  const store = createOSStore();
  const eventBus = createEventBus();
  const screenBounds = createScreenBounds(config);
  const windowManager = createWindowManager(screenBounds);
  const appRegistry = createAppRegistry(windowManager, eventBus, screenBounds);
  const focusManager = createFocusManager(eventBus);

  windowManager.subscribe('os-provider', (windows) => {
    store.getState().setWindows(windows);
  });

  eventBus.on(OS_EVENTS.APP_REGISTERED, () => {
    store.getState().setApps(appRegistry.getAllApps());
  });

  return { store, services: { windowManager, appRegistry, eventBus, focusManager, screenBounds } satisfies OSServices };
}

export function OSProvider({ children, config }: OSProviderProps) {
  const ref = useRef<ReturnType<typeof initServices> | null>(null);
  if (!ref.current) {
    ref.current = initServices(config);
  }

  const { store, services } = ref.current;

  useEffect(() => {
    store.getState().setInitialized(true);
    return () => {
      store.getState().setInitialized(false);
    };
  }, [store]);

  return (
    <OSStoreProvider store={store}>
      <OSServicesProvider value={services}>
        {children}
      </OSServicesProvider>
    </OSStoreProvider>
  );
}
