import { defineConfig } from 'tsdown';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Manifest = { catalogueEntries?: Record<string, string> };

const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as Manifest;

const outputTarget = (source: string) => {
  if (!source.startsWith('./src/') || !source.endsWith('.ts')) throw new Error(`Invalid catalogue source: ${source}`);
  return source.replace('./src/', '../').replace(/\.ts$/, '.js');
};

const catalogueEntries = (entries: Record<string, string>) => ({
  name: 'catalogue-entries',
  generateBundle(this: { emitFile: (asset: { type: 'asset'; fileName: string; source: string }) => string }) {
    for (const [entry, sourceModule] of Object.entries(entries)) {
      const target = outputTarget(sourceModule);
      const source = `export * from '${target}';\nimport * as catalogue from '${target}';\nexport { catalogue as default };\n`;
      this.emitFile({ type: 'asset', fileName: `entries/${entry}.js`, source });
      this.emitFile({ type: 'asset', fileName: `entries/${entry}.d.ts`, source });
    }
  },
});

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
  plugins: manifest.catalogueEntries ? [catalogueEntries(manifest.catalogueEntries)] : [],
});
