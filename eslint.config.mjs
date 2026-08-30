import prettier from 'eslint-config-prettier'
import path from 'node:path'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import unicorn from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'
import svelteConfig from './svelte.config.js'

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore')

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  prettier,
  svelte.configs.prettier,
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      '.svelte-kit/**',
      '*.config.js',
      '*.config.mjs',
      'src/lib/shared/ui/**', // Ignore standard shadcn UI files
    ],
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js', '**/*.ts', '**/*.js'],
    plugins: {
      '@stylistic': stylistic,
      unicorn,
      import: importPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: { allowDefaultProject: ['scripts/*.ts'] },
        extraFileExtensions: ['.svelte'],
        parser: ts.parser,
        svelteConfig,
      },
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    rules: {
      'no-undef': 'off',

      /* --- 1. Formatting (auto-fixable — errors) --- */
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],

      /* --- 2. Line length (not auto-fixable — warn only) --- */
      '@stylistic/max-len': ['warn', { code: 100, ignoreUrls: true }],

      /* --- 3. Naming (not auto-fixable — warn only) --- */
      'max-depth': ['error', 4],
      'id-length': [
        'warn',
        {
          min: 2,
          exceptions: [
            '_',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'm',
            'n',
            'o',
            'p',
            'r',
            's',
            't',
            'v',
            'w',
            'x',
            'y',
            'M',
            'T',
            'W',
            'H',
            'F',
            'S',
          ],
        },
      ],

      'unicorn/prevent-abbreviations': [
        'warn',
        {
          checkFilenames: false,
          replacements: {
            props: false,
            ref: false,
            params: false,
            args: false,
            env: false,
            ext: false,
            dir: false,
            res: false,
            e: false,
          },
        },
      ],

      // Interface naming only — no types to avoid requiring project:true
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
      ],

      /* --- 4. Safety (warn — fix manually over time) --- */
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      'no-console': 'warn',

      /* --- 5. Architecture: Feature-Sliced Design layer boundaries (errors) --- */
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src',
              from: './src/**/helpers.ts',
              message: 'Standard 3.6: Do not use generic helper files.',
            },
            {
              target: './src/lib/shared',
              from: [
                './src/lib/entities',
                './src/lib/features',
                './src/lib/widgets',
                './src/lib/server',
              ],
              message: 'shared/ is foundational and cannot import from any other layer.',
            },
            {
              target: './src/lib/entities',
              from: ['./src/lib/features', './src/lib/widgets', './src/routes'],
              message: 'entities/ may only depend on shared/.',
            },
            {
              target: './src/lib/features',
              from: ['./src/lib/widgets', './src/routes'],
              message: 'features/ may depend on entities/ and shared/, not widgets/ or routes/.',
            },
            {
              target: './src/lib/features/search-profile',
              from: './src/lib/features/customize-theme',
              message: 'A feature never imports another feature.',
            },
            {
              target: './src/lib/features/customize-theme',
              from: './src/lib/features/search-profile',
              message: 'A feature never imports another feature.',
            },
            {
              target: './src/lib/widgets',
              from: './src/routes',
              message: 'widgets/ cannot import from routes/.',
            },
            {
              target: [
                './src/lib/shared',
                './src/lib/entities',
                './src/lib/features',
                './src/lib/widgets',
              ],
              from: './src/lib/server',
              message: 'Server-only code is importable from routes/ and src/lib/server/ only.',
            },
          ],
        },
      ],
    },
  },
  /* 
    Enforce 2-space indentation on standard source files, 
    leaving Svelte files to be validated by svelte-eslint / Prettier.
  */
  {
    files: ['**/*.ts', '**/*.js', '**/*.svelte.ts', '**/*.svelte.js'],
    rules: {
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
    },
  },
)
