import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const BaseDialog = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  className = 'max-w-md',
}: BaseDialogProps) => (
  <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm animate-in fade-in-0" />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-[2001] w-[90vw] -translate-x-1/2 -translate-y-1/2',
          'rounded-xl border border-border/50 bg-card shadow-[var(--os-shadow-window)]',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]',
          'focus:outline-none',
          className,
        )}
        aria-describedby={undefined}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <Dialog.Title className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            {title}
          </Dialog.Title>
          <Dialog.Close
            className={cn(
              'rounded-full p-1 text-muted-foreground',
              'hover:bg-muted hover:text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring/50',
              'transition-colors',
            )}
            aria-label="Close dialog"
          >
            <X size={14} />
          </Dialog.Close>
        </div>
        <div className="p-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
