// Window components
export {
  TrafficLights,
  TitleBar,
  ResizeHandles,
  WindowFrame,
  WindowlessFrame,
  WindowContent,
  WindowErrorBoundary,
  WindowSkeleton,
  WindowRenderer,
} from './components/window';
export type {
  TrafficLightsProps,
  TitleBarProps,
  ResizeHandlesProps,
  ResizeHandle,
  WindowFrameProps,
  WindowlessFrameProps,
  WindowContentProps,
  WindowErrorBoundaryProps,
  WindowSkeletonProps,
  WindowRendererProps,
} from './components/window';

// Desktop components
export {
  DesktopIcon,
  DesktopIconGrid,
  DesktopSurface,
  TrashIcon,
  OSDesktop,
} from './components/desktop';
export type {
  DesktopIconProps,
  DesktopIconGridProps,
  DesktopFileItem,
  DesktopSurfaceProps,
  TrashIconProps,
  TrashDropItem,
  OSDesktopProps,
  DesktopApp,
} from './components/desktop';

// Menu bar
export {
  SystemMenuBar,
  AppleMenu,
  AppMenus,
  ClockWidget,
  SystemTray,
} from './components/menubar';
export type {
  SystemMenuBarProps,
  AppleMenuProps,
  MenuItem,
  AppMenusProps,
  ClockWidgetProps,
  SystemTrayProps,
} from './components/menubar';

// Dialogs
export {
  BaseDialog,
  FileDialog,
  AlertDialog,
  ConfirmDialog,
} from './components/dialogs';
export type {
  BaseDialogProps,
  FileDialogProps,
  AlertDialogProps,
  ConfirmDialogProps,
} from './components/dialogs';

// Notifications
export {
  DesktopNotification,
  NotificationCenter,
} from './components/notifications';
export type {
  DesktopNotificationProps,
  NotificationAction,
  NotificationCenterProps,
  NotificationItem,
} from './components/notifications';

// Store
export { OSStoreProvider, useOSStore } from './store/OSStoreContext';
export type { OSStoreProviderProps } from './store/OSStoreContext';

// Provider
export { OSProvider } from './providers/OSProvider';
export type { OSProviderProps } from './providers/OSProvider';

// Utilities
export { cn } from './lib/utils';
