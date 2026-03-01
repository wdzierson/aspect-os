import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { cn } from '../../lib/utils';

export interface DesktopSurfaceProps {
  wallpaper?: string;
  onDesktopClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function DesktopSurface({
  wallpaper,
  onDesktopClick,
  children,
  className,
}: DesktopSurfaceProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onDesktopClick?.();
      }
    },
    [onDesktopClick],
  );

  const backgroundStyle = wallpaper
    ? wallpaper.startsWith('http') || wallpaper.startsWith('/')
      ? {
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { background: wallpaper }
    : undefined;

  return (
    <div
      data-desktop="true"
      role="application"
      className={cn(
        'fixed inset-0 overflow-hidden',
        'bg-[var(--os-desktop-bg,#1e1e2e)]',
        className,
      )}
      style={backgroundStyle}
      onClick={handleClick}
      aria-label="Desktop"
    >
      {children}
    </div>
  );
}
