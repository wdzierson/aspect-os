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
                  'min-w-[220px] w-max rounded-lg p-1',
                  'os-menu-dropdown border border-border/50',
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
                        'flex min-w-[220px] items-center justify-start px-3 py-1.5 text-[13px] leading-none rounded-md text-left',
                        'outline-none select-none cursor-default',
                        item.destructive
                          ? 'text-destructive data-[highlighted]:bg-destructive/20'
                          : 'os-menu-item text-popover-foreground',
                        item.disabled && 'opacity-40 pointer-events-none',
                      )}
                      disabled={item.disabled}
                      onSelect={() => item.action && onAction(item.action)}
                      aria-label={item.label}
                    >
                      <span>{item.label}</span>
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
