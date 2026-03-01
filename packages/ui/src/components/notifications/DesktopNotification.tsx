import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}

export interface DesktopNotificationProps {
  id: string;
  title: string;
  message: string;
  icon?: ReactNode;
  actions?: NotificationAction[];
  onDismiss: (id: string) => void;
  duration?: number;
  className?: string;
}

export const DesktopNotification = ({
  id,
  title,
  message,
  icon,
  actions,
  onDismiss,
  duration = 5000,
  className,
}: DesktopNotificationProps) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-label={`Notification: ${title}`}
      className={cn(
        'w-80 rounded-xl p-3',
        'bg-popover/95 backdrop-blur-xl border border-border/50',
        'shadow-[var(--os-shadow-floating)]',
        'animate-in slide-in-from-right fade-in-0 duration-300',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {message}
          </p>

          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring/50',
                    action.variant === 'primary'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-foreground hover:bg-muted/80',
                  )}
                  aria-label={action.label}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onDismiss(id)}
          className={cn(
            'shrink-0 rounded-full p-1 text-muted-foreground',
            'hover:bg-muted hover:text-foreground transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring/50',
          )}
          aria-label="Dismiss notification"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
