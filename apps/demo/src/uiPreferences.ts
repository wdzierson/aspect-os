export type InterfaceSize = 'small' | 'medium' | 'large';
export type TextSize = 'small' | 'medium' | 'large';
export type ThemeMode = 'light' | 'dark';

export interface UIPreferences {
  interfaceSize: InterfaceSize;
  textSize: TextSize;
}

const STORAGE_KEY = 'aspectos-ui-preferences';
const EVENT_NAME = 'aspectos-ui-preferences-changed';
const THEME_STORAGE_KEY = 'aspectos-theme-mode';
const ACCENT_STORAGE_KEY = 'aspectos-accent-color';
const ACCENT_DEFAULT = '#3b82f6';

const DEFAULTS: UIPreferences = {
  interfaceSize: 'medium',
  textSize: 'medium',
};

export function getUIPreferences(): UIPreferences {
  if (typeof window === 'undefined') return DEFAULTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Partial<UIPreferences>;
    return {
      interfaceSize:
        parsed.interfaceSize === 'small' || parsed.interfaceSize === 'medium' || parsed.interfaceSize === 'large'
          ? parsed.interfaceSize
          : DEFAULTS.interfaceSize,
      textSize:
        parsed.textSize === 'small' || parsed.textSize === 'medium' || parsed.textSize === 'large'
          ? parsed.textSize
          : DEFAULTS.textSize,
    };
  } catch {
    return DEFAULTS;
  }
}

export function setUIPreferences(next: UIPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
}

export function subscribeUIPreferences(callback: (prefs: UIPreferences) => void): () => void {
  const handler = (event: Event) => {
    callback((event as CustomEvent<UIPreferences>).detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export function getTextScale(size: TextSize): number {
  switch (size) {
    case 'small':
      return 0.92;
    case 'large':
      return 1.08;
    case 'medium':
    default:
      return 1;
  }
}

export function getInterfaceScale(size: InterfaceSize): number {
  switch (size) {
    case 'small':
      return 0.9;
    case 'large':
      return 1.12;
    case 'medium':
    default:
      return 1;
  }
}

export function getThemeMode(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const mode = localStorage.getItem(THEME_STORAGE_KEY);
  return mode === 'dark' || mode === 'light' ? mode : null;
}

export function setThemeMode(mode: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function applyAccentColor(hex: string): void {
  if (typeof document === 'undefined') return;
  const [h, s, l] = hexToHsl(hex);
  const hsl = `${h} ${s}% ${l}%`;
  const root = document.documentElement;
  root.style.setProperty('--os-primary', hsl);
  root.style.setProperty('--os-accent', hsl);
  root.style.setProperty('--os-ring', hsl);
}

export function getAccentColor(): string {
  if (typeof window === 'undefined') return ACCENT_DEFAULT;
  return localStorage.getItem(ACCENT_STORAGE_KEY) ?? ACCENT_DEFAULT;
}

export function setAccentColor(hex: string): void {
  localStorage.setItem(ACCENT_STORAGE_KEY, hex);
  applyAccentColor(hex);
  window.dispatchEvent(new CustomEvent('aspectos-accent-color-changed', { detail: hex }));
}
