import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import jest from 'eslint-plugin-jest';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/libs', '**/infra', '**/coverage', '**/jest.*', '**/release.config.js', '**/next.config.js', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended-type-checked'],
  jest.configs['flat/recommended'],
  jest.configs['flat/style'],
  sonarjs.configs.recommended,
  security.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        // TypeScript 6 no longer loads every @types package; without the Jest globals, assertions in tests look redundant.
        project: ['./tsconfig.eslint.json'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    // Added to the recommended sets by typescript-eslint 8 and sonarjs 4; adopting them is a separate change.
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      'sonarjs/argument-type': 'off',
      'sonarjs/class-name': 'off',
      'sonarjs/constructor-for-side-effects': 'off',
      'sonarjs/deprecation': 'off',
      'sonarjs/different-types-comparison': 'off',
      'sonarjs/function-return-type': 'off',
      'sonarjs/inconsistent-function-call': 'off',
      'sonarjs/no-clear-text-protocols': 'off',
      'sonarjs/no-dead-store': 'off',
      'sonarjs/no-floating-point-equality': 'off',
      'sonarjs/no-nested-assignment': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-redundant-optional': 'off',
      'sonarjs/no-trivial-assertions': 'off',
      'sonarjs/no-undefined-argument': 'off',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/no-useless-intersection': 'off',
      'sonarjs/parameterized-tests': 'off',
      'sonarjs/pseudo-random': 'off',
      'sonarjs/public-static-readonly': 'off',
      'sonarjs/redundant-type-aliases': 'off',
      'sonarjs/regex-complexity': 'off',
      'sonarjs/super-linear-regex': 'off',
      'sonarjs/unused-import': 'off',
      'sonarjs/use-type-alias': 'off',
    },
  },
];
