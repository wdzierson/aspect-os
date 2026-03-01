import { createContext, useContext } from 'react';
import type { WindowManager, AppRegistry, EventBus, FocusManager, ScreenBoundsManager } from '@aspect/os-core';

export interface OSServices {
  windowManager: WindowManager;
  appRegistry: AppRegistry;
  eventBus: EventBus;
  focusManager: FocusManager;
  screenBounds: ScreenBoundsManager;
}

const OSServicesContext = createContext<OSServices | null>(null);

export const OSServicesProvider = OSServicesContext.Provider;

export function useOSServices(): OSServices {
  const services = useContext(OSServicesContext);
  if (!services) {
    throw new Error('useOSServices must be used within an <OSProvider>');
  }
  return services;
}
