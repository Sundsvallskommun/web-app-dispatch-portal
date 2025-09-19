import Core from '@sk-web-gui/core';
import Forms from '@tailwindcss/forms';
import ContainerQueries from '@tailwindcss/container-queries';

import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      spacing: {
        '128': '128px',
        '182': '182px',
        '200': '200px',
        '220': '220px',
        '249': '249px',
        '340': '340px',
        '382': '382px',
        '818': '818px',
      },
    },
  },
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
  plugins: [
    Forms,
    ContainerQueries,
    Core({
      cssBase: true,
      colors: [],
    }),
  ],
} satisfies Config;
