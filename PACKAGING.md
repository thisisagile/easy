# Package entrypoints

All workspace packages publish ESM only. Every package is `"type": "module"`, the
root export resolves `types` to `dist/index.d.ts` and `default` to `dist/index.js`
for both `import` and `require`. Node 20.19 and later load the ESM build through
`require()` as well, so a CommonJS consumer and an ESM consumer in the same
process share one module instance: `ctx`, the `singleton()` registry and every
class identity are the same object wherever they are reached from. The legacy
`main`, `module` and `types` fields point at the same files.

Extensionless leaf paths such as `@thisisagile/easy/domain/DateTime` resolve with
the same `default` condition. One file is emitted per source file (tsdown in
unbundled mode), so root and leaf imports share constructors, including `DateTime`
and `Value`, and emitted specifiers include their `.js` extension.

`scripts/sync-exports.mjs` derives the exports map from `src` after each build:
every source file is a leaf, the root is `index`, and the `src/*`, `dist/*` and
`package.json` passthroughs are kept for compatibility. Adding or removing a source
file changes the published API on the next build; nothing is maintained by hand.
Source paths still contain TypeScript and need the consumer's existing transpiler
and resolution configuration; they are not Node runtime entrypoints.

`build` runs tsdown (JavaScript and declarations, dependencies left external) and
then the exports sync. CI runs `yarn check:exports` after building to check that
all export targets exist and resolve via Node's import and require resolvers.
`node --test test/exports.test.mjs test/sync-exports.test.mjs test/jest-config.test.mjs test/packaging.test.mjs`
checks validation failures, the derived exports map, the Jest source mapping, that
every package executes from both an ESM and a CommonJS process, and that `require`
and `import` hand out the same instance; the packed consumer fixture separately
measures tree shaking.

`yarn test:bundle` also packs every workspace, installs those tarballs together
in a temporary consumer, and executes each root in separate Node ESM and CJS
processes. Test helpers receive their required Jest globals. JWT signing and
verification and email validation are exercised in both formats.

Jest's CommonJS runtime cannot execute the ESM build, so inside this repository
`jest.config.base.js` maps `@thisisagile/*` to the sibling package sources.
Consumers that test with CommonJS Jest must let their transformer handle
`@thisisagile/*` under `node_modules` (`transformIgnorePatterns`), or run Jest in
ESM mode.

The March 2026 packaging attempt exposed CommonJS dependency interop failures
(see `f02a094c` and the subsequent reverts). Runtime imports from `jsonwebtoken`
and `mssql` use their default exports; type-only imports remain named.
Validator leaf imports include `.js`, as Node ESM requires fully specified
external subpaths too. Resolving an export path alone cannot detect these errors.
