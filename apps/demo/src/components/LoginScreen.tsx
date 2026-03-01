import { useState, useEffect, useRef } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  userName?: string;
  userInitials?: string;
  wallpaper?: string;
}

export function LoginScreen({
  onLogin,
  userName = 'Will Dzierson',
  userInitials = 'WD',
  wallpaper = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
}: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    inputRef.current?.focus();
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: wallpaper }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="text-7xl font-light text-white tracking-tight drop-shadow-lg">{timeStr}</div>
          <div className="text-lg text-white/80 mt-1 drop-shadow-md">{dateStr}</div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-10 w-80 animate-os-scale-in"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            {userInitials}
          </div>
          <div className="text-base font-medium text-foreground">{userName}</div>

          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full bg-muted border border-border text-foreground placeholder-muted-foreground text-sm rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-center"
          />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-primary/90 transition-colors"
          >
            Log In
          </button>

          <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Forgot Password?
          </button>
        </form>
      </div>
    </div>
  );
}
