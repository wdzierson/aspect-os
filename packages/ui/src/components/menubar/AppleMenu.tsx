import * as Menubar from '@radix-ui/react-menubar';
import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MenuItem {
  label?: string;
  action?: string;
  shortcut?: string;
  separator?: boolean;
  disabled?: boolean;
  destructive?: boolean;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { label: 'About This Mac', action: 'about' },
  { separator: true },
  { label: 'System Preferences…', action: 'system-preferences' },
  { separator: true },
  { label: 'Sleep', action: 'sleep' },
  { label: 'Restart…', action: 'restart' },
  { label: 'Shut Down…', action: 'shut-down' },
  { separator: true },
  { label: 'Log Out', action: 'log-out', shortcut: '⇧⌘Q' },
];

export interface AppleMenuProps {
  items?: MenuItem[];
  onAction: (action: string) => void;
  className?: string;
}

export const AppleMenu = ({
  items = DEFAULT_ITEMS,
  onAction,
  className,
}: AppleMenuProps) => (
  <Menubar.Menu>
    <Menubar.Trigger
      className={cn(
        'flex h-full items-center gap-1.5 px-2 rounded-[4px] text-foreground/90',
        'data-[state=open]:bg-white/10 hover:bg-white/10',
        'outline-none select-none cursor-default',
        className,
      )}
      aria-label="Bright menu"
    >
      <Zap size={14} />
      <span className="text-[12px] font-semibold tracking-tight">BrightOS</span>
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        className={cn(
          'min-w-[230px] w-max rounded-lg p-1',
          'bg-popover/95 backdrop-blur-xl border border-border/50',
          'shadow-lg',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-top-1',
          'z-[1001]',
        )}
        align="start"
        sideOffset={4}
      >
        {items.map((item, i) =>
          item.separator ? (
            <Menubar.Separator
              key={`sep-${i}`}
              className="my-1 h-px bg-border/50"
            />
          ) : (
            <Menubar.Item
              key={item.action ?? i}
              className={cn(
                'flex min-w-[230px] items-center justify-start px-3 py-1.5 text-[13px] leading-none rounded-md text-left',
                'outline-none select-none cursor-default',
                item.destructive
                  ? 'text-destructive data-[highlighted]:bg-destructive/20'
                  : 'text-popover-foreground data-[highlighted]:bg-white/16 data-[highlighted]:text-popover-foreground',
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
