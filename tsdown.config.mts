import { defineConfig } from 'tsdown';

// One ESM file per source file: consumers get the same module instance whether they import or require a package,
// leaf subpaths stay tree-shakeable, and there is no second CJS copy to split singletons such as ctx.
export default defineConfig({
  cwd: process.cwd(),
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  outDir: 'dist',
  format: ['esm'],
  platform: 'neutral',
  unbundle: true,
  // Transitive dependencies such as bson must stay imports, not get copied into dist as if they were sources.
  deps: { neverBundle: true },
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
});
