import { defineConfig } from 'tsup';
import path from 'node:path';

export const config = defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
  outDir: 'dist',
  format: ['esm', 'cjs'],
  bundle: true,
});
