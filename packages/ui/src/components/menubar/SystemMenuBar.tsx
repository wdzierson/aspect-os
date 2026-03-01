import type { ReactNode } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { cn } from '../../lib/utils';
import { AppleMenu, type MenuItem } from './AppleMenu';
import { AppMenus } from './AppMenus';
import { SystemTray } from './SystemTray';

export interface SystemMenuBarProps {
  appleMenuItems?: MenuItem[];
  appMenus?: Record<string, MenuItem[][]>;
  appMenuLabels?: Record<string, string[]>;
  activeAppId?: string;
  activeAppName?: string;
  activeWindowId?: string | null;
  rightContent?: ReactNode;
  className?: string;
}

export const SystemMenuBar = ({
  appleMenuItems,
  appMenus,
  appMenuLabels,
  activeAppId,
  activeAppName,
  activeWindowId,
  rightContent,
  className,
}: SystemMenuBarProps) => {
  const activeMenus = activeAppId ? appMenus?.[activeAppId] : undefined;
  const activeLabels = activeAppId ? appMenuLabels?.[activeAppId] : undefined;

  const handleAppleAction = (action: string) => {
    window.dispatchEvent(
      new CustomEvent('os:menu-action', { detail: { action, source: 'apple' } }),
    );
  };

  const handleAppAction = (action: string, data?: any) => {
    window.dispatchEvent(
      new CustomEvent('os:menu-action', {
        detail: { action, appId: activeAppId, windowId: activeWindowId, data },
      }),
    );
  };

  return (
    <Menubar.Root
      className={cn(
        'fixed top-0 inset-x-0 h-8 z-[1000]',
        'flex items-center justify-between px-1',
        'os-glass',
        'select-none',
        className,
      )}
      aria-label="System menu bar"
    >
      <div className="flex items-center h-full">
        <AppleMenu items={appleMenuItems} onAction={handleAppleAction} />

        {activeAppName && (
          <span className="px-2.5 text-[13px] font-semibold text-foreground/90 cursor-default">
            {activeAppName}
          </span>
        )}

        {activeMenus && (
          <AppMenus menus={activeMenus} labels={activeLabels} onAction={handleAppAction} />
        )}
      </div>

      <div className="flex items-center h-full">
        {rightContent ?? <SystemTray />}
      </div>
    </Menubar.Root>
  );
};
