import { defineConfig, Format } from 'tsup';
import path from 'node:path';

const commonConfig = {
  clean: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
  outDir: 'dist',
  format: ['esm' as Format],
};

export const config = defineConfig([
  {
    entry: ['src/**/!(index).ts?(x)'],
    ...commonConfig,
  },
  {
    entry: ['src/index.ts', 'src/**/index.ts'],
    ...commonConfig,
    bundle: false,
  },
  {
    entry: ['src/index.ts'],
    ...commonConfig,
    format: ['cjs'],
  },
]);
