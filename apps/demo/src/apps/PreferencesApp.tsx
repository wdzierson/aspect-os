import { useState, type ChangeEvent, type ReactNode } from 'react';
import { Settings, Palette, Monitor, Bell, Volume2 } from 'lucide-react';
import {
  getDesktopBackground,
  setDesktopBackground,
  type DesktopBackgroundKind,
} from '../desktopBackground';
import {
  getUIPreferences,
  setUIPreferences,
  getThemeMode,
  setThemeMode,
  getAccentColor,
  setAccentColor,
  type InterfaceSize,
  type TextSize,
} from '../uiPreferences';

type Category = 'general' | 'appearance' | 'desktop' | 'notifications' | 'sound';

interface SidebarItem {
  id: Category;
  label: string;
  icon: React.ComponentType<any>;
}

const categories: SidebarItem[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'desktop', label: 'Desktop & Wallpaper', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sound', label: 'Sound', icon: Volume2 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${checked ? 'active' : ''}`}
    />
  );
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-foreground/80">{label}</span>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 mt-4 first:mt-0">
      {children}
    </h3>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted border border-border text-foreground text-xs rounded-md px-2 py-1 outline-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

const WALLPAPERS: Array<{ kind: DesktopBackgroundKind; name: string; gradient: string }> = [
  {
    kind: 'gradient-twilight',
    name: 'Twilight',
    gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483, #e94560)',
  },
  {
    kind: 'gradient-ocean',
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #0c2340, #1a3a5c, #2d6187, #45b7d1, #96e6ff)',
  },
  {
    kind: 'gradient-forest',
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #1a2a1a, #2d4a2d, #3e6b3e, #5ca15c, #8cd98c)',
  },
  {
    kind: 'gradient-sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #2d1b3d, #5c2d5c, #b44d7a, #f0926a, #ffd085)',
  },
];

const ACCENT_COLORS = [
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Green', color: '#22c55e' },
];

function GeneralPane() {
  const [autoLaunch, setAutoLaunch] = useState(true);
  const [browser, setBrowser] = useState('Safari');

  return (
    <div>
      <SectionTitle>About</SectionTitle>
      <div className="py-2">
        <div className="text-sm text-foreground font-medium">AspectOS</div>
        <div className="text-xs text-muted-foreground">Version 1.0.0 (Demo)</div>
      </div>

      <SectionTitle>Startup</SectionTitle>
      <SettingRow label="Auto-launch on startup">
        <Toggle checked={autoLaunch} onChange={setAutoLaunch} />
      </SettingRow>

      <SectionTitle>Defaults</SectionTitle>
      <SettingRow label="Default browser">
        <Select value={browser} onChange={setBrowser} options={['Safari', 'Chrome', 'Firefox', 'Arc']} />
      </SettingRow>
    </div>
  );
}

function AppearancePane() {
  const [darkMode, setDarkMode] = useState(() => {
    const persisted = getThemeMode();
    if (persisted) return persisted === 'dark';
    return document.documentElement.classList.contains('dark');
  });
  const [accent, setAccent] = useState(() => getAccentColor());
  const [size, setSize] = useState<InterfaceSize>(() => getUIPreferences().interfaceSize);
  const [textSize, setTextSize] = useState<TextSize>(() => getUIPreferences().textSize);

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      setThemeMode('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setThemeMode('light');
    }
  };

  return (
    <div>
      <SectionTitle>Theme</SectionTitle>
      <SettingRow label="Dark Mode">
        <Toggle checked={darkMode} onChange={toggleDarkMode} />
      </SettingRow>

      <SectionTitle>Accent Color</SectionTitle>
      <div className="flex items-center gap-2.5 py-2">
        {ACCENT_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => { setAccent(c.color); setAccentColor(c.color); }}
            title={c.name}
            className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
              accent === c.color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''
            }`}
            style={{ background: c.color }}
          />
        ))}
      </div>

      <SectionTitle>Interface Size</SectionTitle>
      <div className="flex items-center gap-1 py-2">
        {(['small', 'medium', 'large'] as const).map((s: InterfaceSize) => (
          <button
            key={s}
            onClick={() => {
              setSize(s);
              setUIPreferences({ interfaceSize: s, textSize });
            }}
            className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
              size === s
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <SectionTitle>Text Size</SectionTitle>
      <div className="flex items-center gap-1 py-2">
        {(['small', 'medium', 'large'] as const).map((s: TextSize) => (
          <button
            key={s}
            onClick={() => {
              setTextSize(s);
              setUIPreferences({ interfaceSize: size, textSize: s });
            }}
            className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
              textSize === s
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function DesktopPane() {
  const [selectedKind, setSelectedKind] = useState<DesktopBackgroundKind>(() => getDesktopBackground().kind);
  const [showIcons, setShowIcons] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const selectWallpaper = (kind: DesktopBackgroundKind, value: string) => {
    setSelectedKind(kind);
    setDesktopBackground({ kind, value });
  };

  const applyImageFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (!result) return;
      selectWallpaper('image-custom', `url(${result}) center/cover no-repeat`);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    applyImageFile(file);
    e.currentTarget.value = '';
  };

  return (
    <div>
      <SectionTitle>Wallpaper</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5 py-2">
        {WALLPAPERS.map((wp) => (
          <button
            key={wp.name}
            onClick={() => selectWallpaper(wp.kind, wp.gradient)}
            className={`h-20 rounded-lg overflow-hidden transition-all ${
              selectedKind === wp.kind
                ? 'ring-2 ring-primary scale-[1.02]'
                : 'ring-1 ring-border hover:ring-primary/50'
            }`}
            style={{ background: wp.gradient }}
          >
            <div className="w-full h-full flex items-end p-2">
              <span className="text-[10px] text-white font-medium drop-shadow-md">
                {wp.name}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="pb-2">
        <label className="text-xs font-medium text-muted-foreground">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="mt-1 block w-full text-xs text-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-2 file:py-1 file:text-xs file:text-foreground"
        />
      </div>
      <div className="pb-2">
        <label className="text-xs font-medium text-muted-foreground">Drag Photo Here</label>
        <div
          className={`mt-1 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-xs transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-muted/30 text-muted-foreground'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            applyImageFile(e.dataTransfer.files?.[0]);
          }}
        >
          {isDragOver ? 'Drop image to apply as wallpaper' : 'Drag photo here'}
        </div>
      </div>

      <SectionTitle>Icons</SectionTitle>
      <SettingRow label="Show desktop icons">
        <Toggle checked={showIcons} onChange={setShowIcons} />
      </SettingRow>
    </div>
  );
}

function NotificationsPane() {
  const [dnd, setDnd] = useState(false);
  const [previews, setPreviews] = useState(true);
  const [bannerStyle, setBannerStyle] = useState('Temporary');

  return (
    <div>
      <SectionTitle>Focus</SectionTitle>
      <SettingRow label="Do Not Disturb">
        <Toggle checked={dnd} onChange={setDnd} />
      </SettingRow>

      <SectionTitle>Display</SectionTitle>
      <SettingRow label="Show previews">
        <Toggle checked={previews} onChange={setPreviews} />
      </SettingRow>
      <SettingRow label="Banner style">
        <Select value={bannerStyle} onChange={setBannerStyle} options={['Temporary', 'Persistent']} />
      </SettingRow>
    </div>
  );
}

function SoundPane() {
  const [volume, setVolume] = useState(75);
  const [soundEffects, setSoundEffects] = useState(true);
  const [alertSound, setAlertSound] = useState('Boop');

  return (
    <div>
      <SectionTitle>Output</SectionTitle>
      <div className="py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-foreground/80">Volume</span>
          <span className="text-xs text-muted-foreground">{volume}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-blue-500 h-1 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      <SectionTitle>Effects</SectionTitle>
      <SettingRow label="Play sound effects">
        <Toggle checked={soundEffects} onChange={setSoundEffects} />
      </SettingRow>
      <SettingRow label="Alert sound">
        <Select
          value={alertSound}
          onChange={setAlertSound}
          options={['Boop', 'Ping', 'Submarine', 'Glass', 'Heroine', 'Breeze']}
        />
      </SettingRow>
    </div>
  );
}

const PANES: Record<Category, React.ComponentType> = {
  general: GeneralPane,
  appearance: AppearancePane,
  desktop: DesktopPane,
  notifications: NotificationsPane,
  sound: SoundPane,
};

export function PreferencesApp() {
  const [active, setActive] = useState<Category>('general');
  const Pane = PANES[active];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-border/50 bg-muted/30 py-2 px-2">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
              active === id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Pane />
      </div>
    </div>
  );
}
