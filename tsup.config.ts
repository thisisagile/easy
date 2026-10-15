import { defineConfig, Format } from 'tsup';
import path from 'node:path';

const commonConfig = {
  clean: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
  outDir: 'dist',
  format: ['esm' as Format],
};

export const esmConfig = {
  ...commonConfig,
  entry: ['src/**/*.ts?(x)'],
  splitting: true,
};

export const config = defineConfig([
  esmConfig,
  {
    entry: ['src/index.ts'],
    ...commonConfig,
    format: ['cjs'],
  },
]);
