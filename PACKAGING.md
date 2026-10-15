# Package entrypoints

All workspace packages publish a dual root: `import` selects `dist/index.mjs`,
`require` selects `dist/index.js`, and `types` selects `dist/index.d.ts`.
The legacy `main`, `module` and `types` fields remain available.

Extensionless leaf paths such as `@thisisagile/easy/domain/DateTime` are ESM-only.
Their explicit exports are listed in each package manifest; adding or removing a
source entry requires updating that list. A CJS consumer must use the root.
Puppeteer retains its previously published CJS leaves as an exception.

One esbuild graph emits the ESM root, directory barrels, leaves and shared chunks.
Root and leaf imports therefore share constructors, including `DateTime` and
`Value`. Emitted JavaScript specifiers include their `.mjs` extension.

CJS and ESM are separate graphs. Do not load both formats of a package in one
process and exchange class instances: their constructors have different identity.
Choose one format throughout the application's dependency graph. Conditional
exports select that format; ESM-only leaves deliberately have no `require` or
`default` fallback. Packaging tests exercise ESM and CJS in separate processes
and verify that CJS cannot accidentally load an ESM-only leaf. Explicit dynamic
imports and legacy `dist/*.mjs` paths can still mix formats; they are not guarded.

Published `src/*` and `dist/*` paths remain accessible through passthrough exports
for compatibility. Source paths still contain TypeScript and need the consumer's
existing transpiler and resolution configuration; they are not Node runtime
entrypoints. Do not mix source and compiled imports when passing class instances.
Removing these legacy paths would require a separately proposed major release.

`build` delegates to `build:tsup`. Only tsup emits runtime JavaScript into `dist`;
tsc emits declarations only. CI runs `yarn check:exports` after building to check that all explicit export targets
and every existing legacy-pattern target exist and resolve via Node's import and
require resolvers. `node --test test/exports.test.mjs test/packaging.test.mjs` checks validation failures and runtime identity
after building; the packed consumer fixture separately measures tree shaking.

Declaration emission compiles only the current package. Workspace topological
ordering handles dependencies; forcing TypeScript to rebuild referenced packages
would let concurrent builds overwrite the same declarations. Declaration emission
is non-incremental so it always restores the files removed by tsup's clean step.

`yarn test:bundle` also packs every workspace, installs those tarballs together
in a temporary consumer, and executes each root in separate Node ESM and CJS
processes. Test helpers receive their required Jest globals. JWT signing and
verification and email validation are exercised in both formats.

The March 2026 packaging attempt exposed CommonJS dependency interop failures
(see `f02a094c` and the subsequent reverts). Runtime imports from `jsonwebtoken`
and `mssql` use their default exports; type-only imports remain named.
Validator leaf imports include `.js`, as Node ESM requires fully specified
external subpaths too. Resolving an export path alone cannot detect these errors.
