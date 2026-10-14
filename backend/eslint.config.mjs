import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...tsPlugin.configs['flat/recommended'],
  prettierRecommended,
  eslintConfigPrettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
];
