import { defineConfig } from 'tsup';
import path from 'node:path';
import { esmConfig } from '../../tsup.config';

export default defineConfig([
  esmConfig,
  {
    clean: true,
    sourcemap: true,
    tsconfig: path.resolve(__dirname, './tsconfig.json'),
    entry: ['src/**/*.ts?(x)'],
    bundle: false,
    format: ['cjs'],
    outDir: 'dist',
  },
]);
