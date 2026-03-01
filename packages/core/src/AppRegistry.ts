import type { AppManifest, WindowState } from './types';
import type { WindowManager } from './WindowManager';
import type { EventBus } from './EventBus';
import type { ScreenBoundsManager } from './ScreenBounds';
import { windowManager as defaultWM } from './WindowManager';
import { eventBus as defaultEB, OS_EVENTS } from './EventBus';
import { screenBounds as defaultSB } from './ScreenBounds';

export class AppRegistry {
  private apps: AppManifest[] = [];
  private userApps: AppManifest[] = [];
  private runningApps = new Map<string, AppManifest>();
  private runningByAppId = new Map<string, string[]>();
  private wm: WindowManager;
  private eb: EventBus;
  private sb: ScreenBoundsManager;

  constructor(wm?: WindowManager, eb?: EventBus, sb?: ScreenBoundsManager) {
    this.wm = wm ?? defaultWM;
    this.eb = eb ?? defaultEB;
    this.sb = sb ?? defaultSB;
  }

  registerApp(manifest: AppManifest): void {
    if (this.apps.find((a) => a.id === manifest.id)) {
      throw new Error(`App ${manifest.id} already registered`);
    }
    this.apps.push(manifest);
    this.eb.emit(OS_EVENTS.APP_REGISTERED, { app: manifest }, 'AppRegistry');
  }

  registerUserApp(manifest: AppManifest): void {
    if (this.userApps.find((a) => a.id === manifest.id)) {
      throw new Error(`User app ${manifest.id} already registered`);
    }
    this.userApps.push(manifest);
    this.eb.emit(OS_EVENTS.APP_REGISTERED, { app: manifest }, 'AppRegistry');
  }

  getApp(id: string): AppManifest | undefined {
    return this.apps.find((a) => a.id === id) ?? this.userApps.find((a) => a.id === id);
  }

  getAllApps(): AppManifest[] {
    return [...this.apps, ...this.userApps];
  }

  getUserApps(): AppManifest[] {
    return [...this.userApps];
  }

  launchApp(appId: string, windowId?: string, options?: Record<string, any>): string {
    const app = this.getApp(appId);
    if (!app) throw new Error(`App ${appId} not found`);

    const finalId = windowId ?? `${appId}-${Date.now()}`;

    let pos;
    if (app.preferredPosition && app.preferredPosition !== 'cascade' && app.preferredPosition !== 'center') {
      pos = this.sb.getSafeCornerPosition(app.defaultWidth, app.defaultHeight, app.preferredPosition);
    } else if (app.preferredPosition === 'center') {
      const b = this.sb.getBounds();
      pos = {
        x: Math.max(b.minMargin, (b.width - app.defaultWidth) / 2),
        y: Math.max(b.menuBarHeight + b.minMargin, (b.height - app.defaultHeight) / 2),
      };
    } else {
      pos = this.sb.getSafeWindowPosition(app.defaultWidth, app.defaultHeight);
    }

    const windowState: WindowState = {
      id: finalId,
      title: app.defaultTitle,
      x: pos.x,
      y: pos.y,
      width: app.defaultWidth,
      height: app.defaultHeight,
      zIndex: 0,
      isFocused: true,
      isMinimized: false,
      isMaximized: false,
      isVisible: true,
      isModal: false,
      appId,
      metadata: options as Record<string, unknown>,
    };

    this.wm.createWindow(windowState);
    this.runningApps.set(finalId, app);
    if (!this.runningByAppId.has(appId)) this.runningByAppId.set(appId, []);
    this.runningByAppId.get(appId)!.push(finalId);

    this.eb.emit(OS_EVENTS.APP_LAUNCHED, { appId, windowId: finalId, options }, 'AppRegistry');
    this.eb.emit(OS_EVENTS.WINDOW_OPENED, { windowId: finalId, appId }, 'AppRegistry');

    return finalId;
  }

  closeApp(windowId: string): void {
    const app = this.runningApps.get(windowId);
    if (app) {
      const ids = this.runningByAppId.get(app.id) ?? [];
      this.runningByAppId.set(app.id, ids.filter((id) => id !== windowId));
      if (this.runningByAppId.get(app.id)?.length === 0) this.runningByAppId.delete(app.id);
    }
    this.wm.closeWindow(windowId);
    this.runningApps.delete(windowId);
    this.eb.emit(OS_EVENTS.APP_QUIT, { windowId, appId: app?.id }, 'AppRegistry');
  }

  quitApp(windowId: string): void {
    this.closeApp(windowId);
  }

  getRunningApp(identifier: string): AppManifest | undefined {
    const byWindow = this.runningApps.get(identifier);
    if (byWindow) return byWindow;
    const ids = this.runningByAppId.get(identifier);
    if (ids?.length) return this.runningApps.get(ids[0]);
    return undefined;
  }

  getRunningAppWindows(appId: string): string[] {
    return this.runningByAppId.get(appId) ?? [];
  }

  isAppRunning(appId: string): boolean {
    return (this.runningByAppId.get(appId)?.length ?? 0) > 0;
  }

  removeUserApp(appId: string): void {
    this.userApps = this.userApps.filter((a) => a.id !== appId);
  }
}

export function createAppRegistry(wm?: WindowManager, eb?: EventBus, sb?: ScreenBoundsManager): AppRegistry {
  return new AppRegistry(wm, eb, sb);
}

export const appRegistry = createAppRegistry();
