export type {
  WindowPosition,
  WindowState,
  WindowConfig,
  AppManifest,
  AppContext,
  OSConfig,
  ScreenBounds,
  Coordinates,
  Dimensions,
  OSEvent,
  EventCallback,
  FocusState,
} from './types';

export { EventBus, createEventBus, eventBus, OS_EVENTS } from './EventBus';
export type { OSEventType } from './EventBus';

export { ScreenBoundsManager, createScreenBounds, screenBounds } from './ScreenBounds';

export { WindowManager, createWindowManager, windowManager } from './WindowManager';

export { AppRegistry, createAppRegistry, appRegistry } from './AppRegistry';

export { FocusManager, createFocusManager, focusManager } from './FocusManager';
export type { FocusCallbacks } from './FocusManager';

export { createOSStore } from './store/createOSStore';
export type { OSStoreState, OSStoreUI, OSStore, UseOSStore } from './store/createOSStore';
