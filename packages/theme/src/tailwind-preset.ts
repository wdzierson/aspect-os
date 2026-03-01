import type { Config } from 'tailwindcss';

export const aspectOSPreset: Partial<Config> = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--os-border))',
        input: 'hsl(var(--os-input))',
        ring: 'hsl(var(--os-ring))',
        background: 'hsl(var(--os-background))',
        foreground: 'hsl(var(--os-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--os-primary))',
          foreground: 'hsl(var(--os-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--os-secondary))',
          foreground: 'hsl(var(--os-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--os-destructive))',
          foreground: 'hsl(var(--os-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--os-muted))',
          foreground: 'hsl(var(--os-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--os-accent))',
          foreground: 'hsl(var(--os-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--os-popover))',
          foreground: 'hsl(var(--os-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--os-card))',
          foreground: 'hsl(var(--os-card-foreground))',
        },
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
      },
      spacing: {
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
      },
      borderRadius: {
        xs: '2px',
        sm: 'var(--os-radius-sm)',
        DEFAULT: 'var(--os-radius)',
        lg: 'var(--os-radius-lg)',
        xl: 'var(--os-radius-xl)',
        '2xl': '24px',
      },
      boxShadow: {
        xs: 'var(--os-shadow-xs)',
        sm: 'var(--os-shadow-sm)',
        md: 'var(--os-shadow-md)',
        lg: 'var(--os-shadow-lg)',
        xl: 'var(--os-shadow-xl)',
        window: 'var(--os-shadow-window)',
        floating: 'var(--os-shadow-floating)',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      fontFamily: {
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
      },
      transitionDuration: {
        fast: 'var(--os-duration-fast)',
        normal: 'var(--os-duration-normal)',
        slow: 'var(--os-duration-slow)',
      },
      transitionTimingFunction: {
        'ease-out': 'var(--os-ease-out)',
        'ease-in-out': 'var(--os-ease-in-out)',
      },
      keyframes: {
        'os-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'os-scale-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.96)' },
        },
        'os-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'os-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(4px)' },
        },
        'os-slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'os-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'os-slide-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'os-scale-in': 'os-scale-in 200ms var(--os-ease-out)',
        'os-scale-out': 'os-scale-out 200ms var(--os-ease-out)',
        'os-fade-in': 'os-fade-in 250ms var(--os-ease-out)',
        'os-fade-out': 'os-fade-out 250ms var(--os-ease-out)',
        'os-slide-down': 'os-slide-down 250ms var(--os-ease-out)',
        'os-slide-up': 'os-slide-up 250ms var(--os-ease-out)',
        'os-slide-right': 'os-slide-right 300ms var(--os-ease-out)',
      },
    },
  },
};

export default aspectOSPreset;
