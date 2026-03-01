import * as Menubar from '@radix-ui/react-menubar';
import { cn } from '../../lib/utils';
import type { MenuItem } from './AppleMenu';

export interface AppMenusProps {
  menus: MenuItem[][];
  labels?: string[];
  onAction: (action: string, data?: any) => void;
  className?: string;
}

const DEFAULT_LABELS = ['File', 'Edit', 'View', 'Window', 'Help'];

export const AppMenus = ({
  menus,
  labels,
  onAction,
  className,
}: AppMenusProps) => {
  const menuLabels = labels ?? DEFAULT_LABELS;

  return (
    <>
      {menus.map((group, gi) => {
        const label = menuLabels[gi] ?? `Menu ${gi + 1}`;
        return (
          <Menubar.Menu key={label}>
            <Menubar.Trigger
              className={cn(
                'flex h-full items-center px-2.5 rounded-[4px] text-[13px]',
                'text-foreground/80 font-normal',
                'data-[state=open]:bg-white/10 hover:bg-white/10',
                'outline-none select-none cursor-default',
                className,
              )}
              aria-label={`${label} menu`}
            >
              {label}
            </Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                className={cn(
                  'min-w-[180px] rounded-lg p-1',
                  'bg-popover/95 backdrop-blur-xl border border-border/50',
                  'shadow-lg',
                  'animate-in fade-in-0 zoom-in-95 slide-in-from-top-1',
                  'z-[1001]',
                )}
                align="start"
                sideOffset={4}
              >
                {group.map((item, ii) =>
                  item.separator ? (
                    <Menubar.Separator
                      key={`sep-${ii}`}
                      className="my-1 h-px bg-border/50"
                    />
                  ) : (
                    <Menubar.Item
                      key={item.action ?? ii}
                      className={cn(
                        'flex items-center justify-between px-3 py-1.5 text-[13px] leading-none rounded-md',
                        'outline-none select-none cursor-default',
                        item.destructive
                          ? 'text-destructive focus:bg-destructive/10'
                          : 'text-popover-foreground focus:bg-accent focus:text-accent-foreground',
                        item.disabled && 'opacity-40 pointer-events-none',
                      )}
                      disabled={item.disabled}
                      onSelect={() => item.action && onAction(item.action)}
                      aria-label={item.label}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto pl-4 text-[11px] text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </Menubar.Item>
                  ),
                )}
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        );
      })}
    </>
  );
};
