import js from '@eslint/js';
import nextConfig from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['src/**/data-contracts/**'],
  },
  js.configs.recommended,
  ...nextConfig,
  ...nextTs,
  {
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.jest },
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
    },
  },
  eslintConfigPrettier,
];
