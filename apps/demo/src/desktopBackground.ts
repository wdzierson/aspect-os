export type DesktopBackgroundKind =
  | 'gradient-twilight'
  | 'gradient-ocean'
  | 'gradient-forest'
  | 'gradient-sunset'
  | 'image-custom';

export interface DesktopBackgroundState {
  kind: DesktopBackgroundKind;
  value: string;
}

const STORAGE_KEY = 'aspectos-desktop-background';
const EVENT_NAME = 'aspectos-desktop-background-changed';

const DEFAULT_BACKGROUND: DesktopBackgroundState = {
  kind: 'gradient-twilight',
  value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
};

export function getDesktopBackground(): DesktopBackgroundState {
  if (typeof window === 'undefined') return DEFAULT_BACKGROUND;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_BACKGROUND;
  try {
    const parsed = JSON.parse(raw) as DesktopBackgroundState;
    if (parsed?.kind && typeof parsed.value === 'string') {
      return parsed;
    }
  } catch {
    // Ignore invalid persisted data and fall back to defaults.
  }
  return DEFAULT_BACKGROUND;
}

export function setDesktopBackground(next: DesktopBackgroundState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
}

export function subscribeDesktopBackground(
  callback: (state: DesktopBackgroundState) => void,
): () => void {
  const handler = (event: Event) => callback((event as CustomEvent<DesktopBackgroundState>).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
