import type { Config } from 'tailwindcss';
import { aspectOSPreset } from '@aspect/os-theme/preset';

export default {
  presets: [aspectOSPreset as Config],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  plugins: [],
} satisfies Config;
