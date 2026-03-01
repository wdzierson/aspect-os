import { useState, type ReactNode } from 'react';

const categories = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'desktop', label: 'Desktop', icon: '🖥️' },
  { id: 'sound', label: 'Sound', icon: '🔊' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
] as const;

type CategoryId = (typeof categories)[number]['id'];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? 'bg-accent' : 'bg-border'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 first:mt-0">{children}</h3>;
}

const wallpaperColors = [
  { name: 'Indigo Violet', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Ocean Blue', gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: 'Sunset', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Forest', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Midnight', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { name: 'Warm Flame', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
];

function GeneralPanel() {
  const [autoHide, setAutoHide] = useState(false);
  const [askClose, setAskClose] = useState(true);
  const [recentItems, setRecentItems] = useState('10');

  return (
    <div>
      <SectionTitle>Interface</SectionTitle>
      <Row label="Auto-hide menu bar">
        <Toggle checked={autoHide} onChange={setAutoHide} />
      </Row>
      <Row label="Ask before closing windows">
        <Toggle checked={askClose} onChange={setAskClose} />
      </Row>
      <Row label="Recent items">
        <select
          value={recentItems}
          onChange={(e) => setRecentItems(e.target.value)}
          className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm border border-border/50 outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </Row>
    </div>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reduceTransparency, setReduceTransparency] = useState(false);

  const accents = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#22c55e', '#06b6d4', '#6b7280'];

  return (
    <div>
      <SectionTitle>Theme</SectionTitle>
      <div className="flex gap-3 py-3 border-b border-border/30">
        {(['light', 'dark', 'auto'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              theme === t
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
            }`}
          >
            {t === 'auto' ? 'Auto' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <SectionTitle>Accent Color</SectionTitle>
      <div className="flex gap-2 py-3 border-b border-border/30">
        {accents.map((c) => (
          <button
            key={c}
            onClick={() => setAccentColor(c)}
            className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
              accentColor === c ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground/30 scale-110' : ''
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <SectionTitle>Accessibility</SectionTitle>
      <Row label="Reduce motion">
        <Toggle checked={reduceMotion} onChange={setReduceMotion} />
      </Row>
      <Row label="Reduce transparency">
        <Toggle checked={reduceTransparency} onChange={setReduceTransparency} />
      </Row>
    </div>
  );
}

function DesktopPanel() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <SectionTitle>Wallpaper</SectionTitle>
      <div className="grid grid-cols-3 gap-3 py-3">
        {wallpaperColors.map((w, i) => (
          <button
            key={w.name}
            onClick={() => setSelected(i)}
            className={`h-20 rounded-lg transition-all hover:scale-[1.03] ${
              selected === i ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''
            }`}
            style={{ background: w.gradient }}
          >
            <span className="text-white text-xs font-medium drop-shadow-md">{w.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SoundPanel() {
  const [alertVolume, setAlertVolume] = useState(75);
  const [playStartup, setPlayStartup] = useState(true);
  const [playUI, setPlayUI] = useState(true);
  const [outputDevice, setOutputDevice] = useState('speakers');

  return (
    <div>
      <SectionTitle>Output</SectionTitle>
      <Row label="Output device">
        <select
          value={outputDevice}
          onChange={(e) => setOutputDevice(e.target.value)}
          className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm border border-border/50 outline-none"
        >
          <option value="speakers">Built-in Speakers</option>
          <option value="headphones">Headphones</option>
          <option value="bluetooth">Bluetooth Audio</option>
        </select>
      </Row>

      <SectionTitle>Effects</SectionTitle>
      <Row label="Alert volume">
        <input
          type="range"
          min={0}
          max={100}
          value={alertVolume}
          onChange={(e) => setAlertVolume(Number(e.target.value))}
          className="w-32 accent-accent"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">{alertVolume}%</span>
      </Row>
      <Row label="Play sound on startup">
        <Toggle checked={playStartup} onChange={setPlayStartup} />
      </Row>
      <Row label="Play UI sound effects">
        <Toggle checked={playUI} onChange={setPlayUI} />
      </Row>
    </div>
  );
}

function NotificationsPanel() {
  const [enabled, setEnabled] = useState(true);
  const [banners, setBanners] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [badges, setBadges] = useState(true);
  const [style, setStyle] = useState<'banners' | 'alerts'>('banners');

  return (
    <div>
      <SectionTitle>Notifications</SectionTitle>
      <Row label="Allow notifications">
        <Toggle checked={enabled} onChange={setEnabled} />
      </Row>
      <Row label="Show banners">
        <Toggle checked={banners} onChange={setBanners} />
      </Row>
      <Row label="Play notification sounds">
        <Toggle checked={sounds} onChange={setSounds} />
      </Row>
      <Row label="Show badge count">
        <Toggle checked={badges} onChange={setBadges} />
      </Row>

      <SectionTitle>Notification Style</SectionTitle>
      <div className="flex gap-3 py-3">
        {(['banners', 'alerts'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              style === s
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

const panels: Record<CategoryId, () => JSX.Element> = {
  general: GeneralPanel,
  appearance: AppearancePanel,
  desktop: DesktopPanel,
  sound: SoundPanel,
  notifications: NotificationsPanel,
};

export function Settings() {
  const [active, setActive] = useState<CategoryId>('general');
  const Panel = panels[active];

  return (
    <div className="flex h-full">
      <nav className="w-48 shrink-0 border-r border-border/50 bg-muted/20 p-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              active === cat.id
                ? 'bg-accent/15 text-accent font-medium'
                : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </nav>
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {categories.find((c) => c.id === active)?.label}
        </h2>
        <Panel />
      </main>
    </div>
  );
}
