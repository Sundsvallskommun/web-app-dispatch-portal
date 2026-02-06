import { preset } from '@sk-web-gui/core';

import type { Config } from 'tailwindcss';

export default {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sk-web-gui/*/dist/**/*.js',
  ],
  safelist: [
    'bg-vattjom-background-100',
    'bg-juniskar-background-100',
    'bg-gronsta-background-100',
    'bg-bjornstigen-background-100',
    'bg-warning-background-100',
    'bg-error-background-100',
  ],

  darkMode: 'class', // or 'media' or 'class'
  presets: [preset()],
} satisfies Config;
