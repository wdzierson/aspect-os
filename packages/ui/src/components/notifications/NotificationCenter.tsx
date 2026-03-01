import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { DesktopNotification, type NotificationAction } from './DesktopNotification';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  icon?: ReactNode;
  actions?: NotificationAction[];
  duration?: number;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  maxVisible?: number;
  className?: string;
}

export const NotificationCenter = ({
  notifications,
  onDismiss,
  maxVisible = 3,
  className,
}: NotificationCenterProps) => {
  const visible = notifications.slice(0, maxVisible);

  if (visible.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed top-10 right-4 z-[3000] flex flex-col gap-2',
        className,
      )}
      aria-label="Notifications"
      role="region"
      aria-live="polite"
    >
      {visible.map((n) => (
        <DesktopNotification
          key={n.id}
          id={n.id}
          title={n.title}
          message={n.message}
          icon={n.icon}
          actions={n.actions}
          duration={n.duration}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};
