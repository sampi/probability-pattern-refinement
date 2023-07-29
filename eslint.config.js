import path from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'
import parserTS from '@typescript-eslint/parser'
import configStandardWithTS from 'eslint-config-standard-with-typescript'

// mimic CommonJS variables
// ESLint would complain about the double underscore prefix, but we need it here
/* eslint-disable-next-line @typescript-eslint/naming-convention */
const __filename = fileURLToPath(import.meta.url)
/* eslint-disable-next-line @typescript-eslint/naming-convention */
const __dirname = path.dirname(__filename) ?? process.cwd()

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: configStandardWithTS,
  allConfig: configStandardWithTS,
})

export default [
  ...compat.extends('standard-with-typescript'),
  ...compat.extends('plugin:prettier/recommended'),
  ...compat.extends('plugin:import/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react/jsx-runtime'),
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.plugins('react-refresh'),
  {
    files: ['**/*.ts(x)', '**/*.js'],
    ignores: ['dist'],
    languageOptions: {
      parser: parserTS,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      /* This rule was added by create-vite, to make sure that Hot Reloading works */
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      /* For readability, I prefer to have the imports in order, separated by newlines */
      'import/order': [
        'error',
        {
          'warnOnUnassignedImports': true,
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'pathGroups': [
            {
              pattern: '{.,..}/*.css',
              group: 'object',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.css',
              group: 'object',
              position: 'after',
            },
          ],
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],
    },
  },
]
