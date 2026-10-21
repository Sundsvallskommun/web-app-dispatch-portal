import nextConfig from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextConfig,
  ...nextTs,
  {
    ignores: ['src/**/data-contracts/**'],
  },
  {
    rules: {
      // Promoted to error in eslint-plugin-react-hooks 7.1. Kept as a warning for now; revisit when refactoring the affected effects.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // Root config files and build scripts are CommonJS and are loaded by Node/Next with require().
    files: ['*.config.js', 'next-i18next.config.js', 'scripts/**/*.js', '.jest/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  eslintConfigPrettier,
];

export default config;
