export const colors = {
  background: 'hsl(var(--os-background))',
  foreground: 'hsl(var(--os-foreground))',
  card: {
    DEFAULT: 'hsl(var(--os-card))',
    foreground: 'hsl(var(--os-card-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--os-popover))',
    foreground: 'hsl(var(--os-popover-foreground))',
  },
  primary: {
    DEFAULT: 'hsl(var(--os-primary))',
    foreground: 'hsl(var(--os-primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--os-secondary))',
    foreground: 'hsl(var(--os-secondary-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--os-muted))',
    foreground: 'hsl(var(--os-muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--os-accent))',
    foreground: 'hsl(var(--os-accent-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--os-destructive))',
    foreground: 'hsl(var(--os-destructive-foreground))',
  },
  border: 'hsl(var(--os-border))',
  input: 'hsl(var(--os-input))',
  ring: 'hsl(var(--os-ring))',
  mac: {
    red: 'hsl(var(--os-mac-red))',
    yellow: 'hsl(var(--os-mac-yellow))',
    green: 'hsl(var(--os-mac-green))',
  },
  window: {
    bg: 'hsl(var(--os-window-bg))',
    border: 'hsl(var(--os-window-border))',
    title: 'hsl(var(--os-window-title-bg))',
    chrome: 'hsl(var(--os-window-chrome))',
    shadow: 'hsl(var(--os-window-shadow))',
  },
  glass: {
    bg: 'hsl(var(--os-glass-bg))',
    border: 'hsl(var(--os-glass-border))',
    shadow: 'hsl(var(--os-glass-shadow))',
  },
  sidebar: {
    DEFAULT: 'hsl(var(--os-sidebar-background))',
    foreground: 'hsl(var(--os-sidebar-foreground))',
    primary: 'hsl(var(--os-sidebar-primary))',
    'primary-foreground': 'hsl(var(--os-sidebar-primary-foreground))',
    accent: 'hsl(var(--os-sidebar-accent))',
    'accent-foreground': 'hsl(var(--os-sidebar-accent-foreground))',
    border: 'hsl(var(--os-sidebar-border))',
  },
} as const;

export const spacing = {
  '1': 'var(--os-space-1)',
  '2': 'var(--os-space-2)',
  '3': 'var(--os-space-3)',
  '4': 'var(--os-space-4)',
  '5': 'var(--os-space-5)',
  '6': 'var(--os-space-6)',
  '8': 'var(--os-space-8)',
  '10': 'var(--os-space-10)',
  '12': 'var(--os-space-12)',
  '16': 'var(--os-space-16)',
} as const;

export const radius = {
  sm: 'var(--os-radius-sm)',
  DEFAULT: 'var(--os-radius)',
  lg: 'var(--os-radius-lg)',
  xl: 'var(--os-radius-xl)',
} as const;

export const shadows = {
  xs: 'var(--os-shadow-xs)',
  sm: 'var(--os-shadow-sm)',
  md: 'var(--os-shadow-md)',
  lg: 'var(--os-shadow-lg)',
  xl: 'var(--os-shadow-xl)',
  window: 'var(--os-shadow-window)',
  floating: 'var(--os-shadow-floating)',
} as const;

export const animation = {
  duration: {
    fast: 'var(--os-duration-fast)',
    normal: 'var(--os-duration-normal)',
    slow: 'var(--os-duration-slow)',
  },
  easing: {
    out: 'var(--os-ease-out)',
    inOut: 'var(--os-ease-in-out)',
  },
} as const;

export const zIndex = {
  desktop: 0,
  window: 100,
  menubar: 1000,
  dialog: 2000,
  notification: 3000,
  tooltip: 4000,
} as const;

export const fonts = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Display',
    'SF Pro Text',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'SF Mono',
    'Fira Code',
    'Fira Mono',
    'Roboto Mono',
    'monospace',
  ],
  system: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
} as const;
