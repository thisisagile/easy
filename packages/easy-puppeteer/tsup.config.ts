import { defineConfig } from 'tsup';
import path from 'node:path';

export default defineConfig({
  clean: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
  entry: ['src/**/*.ts?(x)'],
  bundle: false,
  format: ['esm', 'cjs'],
  outDir: 'dist',
});
