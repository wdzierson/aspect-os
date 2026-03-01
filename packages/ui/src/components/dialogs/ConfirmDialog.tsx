import { useEffect, useCallback, useRef, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  icon?: ReactNode;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  icon,
}: ConfirmDialogProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleConfirm]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[2001] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2',
            'rounded-xl border border-border/50 bg-card shadow-[var(--os-shadow-window)]',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]',
            'focus:outline-none',
          )}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            confirmRef.current?.focus();
          }}
        >
          <div className="flex flex-col items-center px-6 pt-6 pb-2 text-center">
            {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
            <Dialog.Title className="text-sm font-semibold text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              {message}
            </Dialog.Description>
          </div>

          <div className="flex justify-center gap-2 px-6 pb-5 pt-3">
            <button
              onClick={onClose}
              className={cn(
                'rounded-lg border border-border/50 px-4 py-1.5 text-xs font-medium text-foreground',
                'hover:bg-muted transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring/50',
              )}
              aria-label={cancelLabel}
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              onClick={handleConfirm}
              className={cn(
                'rounded-lg px-4 py-1.5 text-xs font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring/50',
                variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
              aria-label={confirmLabel}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
