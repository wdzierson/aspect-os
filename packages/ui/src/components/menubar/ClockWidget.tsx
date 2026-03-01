import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ClockWidgetProps {
  showDate?: boolean;
  showTime?: boolean;
  format24h?: boolean;
  className?: string;
}

function formatTime(date: Date, format24h: boolean): string {
  const hours = format24h
    ? date.getHours().toString().padStart(2, '0')
    : ((date.getHours() % 12) || 12).toString();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = format24h ? '' : date.getHours() >= 12 ? ' PM' : ' AM';
  return `${hours}:${minutes}${suffix}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export const ClockWidget = ({
  showDate = true,
  showTime = true,
  format24h = false,
  className,
}: ClockWidgetProps) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs text-foreground/80 select-none',
        className,
      )}
      aria-label="System clock"
      role="status"
      aria-live="polite"
    >
      {showDate && (
        <span className="flex items-center gap-1">
          <Calendar size={12} aria-hidden />
          {formatDate(now)}
        </span>
      )}
      {showTime && (
        <span className="flex items-center gap-1">
          <Clock size={12} aria-hidden />
          {formatTime(now, format24h)}
        </span>
      )}
    </div>
  );
};
