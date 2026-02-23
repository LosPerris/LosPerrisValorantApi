import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts', 'api/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      },
      ecmaVersion: 2020
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
]
