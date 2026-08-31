import nextConfig from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextTs from 'eslint-config-next/typescript';

export default [
  ...nextConfig,
  ...nextTs,
  {
    ignores: ['src/**/data-contracts/**'],
  },
  eslintConfigPrettier,
];
