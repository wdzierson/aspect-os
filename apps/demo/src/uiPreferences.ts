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
