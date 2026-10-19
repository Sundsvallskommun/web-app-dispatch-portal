import js from '@eslint/js';
import nextConfig from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

const config = [
  {
    ignores: ['src/**/data-contracts/**'],
  },
  js.configs.recommended,
  ...nextConfig,
  ...nextTs,
  {
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowExportNames: [
            'generateMetadata',
            'generateStaticParams',
            'metadata',
            'dynamic',
            'revalidate',
            'getServerSideProps',
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // Promoted to error in eslint-plugin-react-hooks 7.1. Kept as a warning for now; revisit when refactoring the affected effects.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // Root config files and build scripts are CommonJS and are loaded by Node/Next with require().
    files: ['*.config.js', 'scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  eslintConfigPrettier,
];

export default config;
