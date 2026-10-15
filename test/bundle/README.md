# Packed consumer baseline

Run from the repository root after building:

```sh
yarn test:bundle
node test/bundle/check.mjs --save
```

The first command is the CI gate. The second deliberately replaces the historical
baseline; review it before committing. Both exit nonzero on any failed load or
bundle, even when saving. A baseline containing failures records a defect; it does
not waive it. Item 2's root `isDefined` ceiling is 100 raw bytes on both platforms,
confirmed feasible by a 47-byte current measurement. Other ceilings remain unset.

The runner uses `yarn pack`, installs that tarball with npm in a new OS temporary
directory, and bundles only installed package files with pinned esbuild 0.18.20.
Runtime dependencies resolve from the package's declared ranges, not workspace
links. The report includes the exact installation lock and tool versions so changes
in dependency resolution are visible. Different Node/zlib versions can affect gzip
sizes; use matching versions for size comparisons. Installation scripts are disabled.

Each symbol has root and published ESM leaf consumers for browser and node.
An explicit CJS consumer uses main-first resolution throughout its dependency
graph to measure the fallback independently when ESM is broken. Root/leaf consumers
use module-first resolution on both platforms. A namespace consumer measures the
full root API. Exported functions/classes stay observable instead of being removed
as unused code. Enum uses a real subclass with an instantiated static member.

Reports contain raw/minified and gzip bytes, emitted package modules and their
byte contributions, emitted dependency modules, third-party package names, and
external imports (including Node builtins). Only positive `bytesInOutput` inputs
count as retained. Already-bundled published files are indivisible attribution
units: a CJS `dist/index.js` entry does not reveal its original internal modules.
No node_modules filtering, aliases to workspace sources, or dependency externals
are used. These are bundle measurements; the bundles themselves are not executed.

Node checks run in separate processes: explicit dynamic import of the advertised
`module` target, dynamic import of the package root, and require of the root.
Checking the advertised target prevents Node's CJS fallback from hiding broken ESM.

`report.json` is generated on every completed run, ignored locally and archived
by CI even on failure. `baseline.json` is the reviewed first measurement.
UseCase static facades and full namespace/catalogue consumers intentionally retain
their catalogue. Their cost is measured, not treated as a defect.

The harness lives outside the published workspace and does not alter public APIs.
The shared runner/summary shape in the two repositories keeps each repository's
CI independent; changes to measurement semantics should be applied to both.

`node test/bundle/check.mjs --head --save` measures the committed HEAD instead of the
working tree: it archives HEAD to a temporary directory, emits JS and declarations with
HEAD's tsup configuration using the installed build tools, then packs it. The report
records that commit. It does not replace the working-tree dist.

The committed baseline is the first measurement after the ESM packaging fix. Before it,
the advertised ESM entry failed to load and every root and leaf bundle failed to resolve;
only the CJS fallback worked, at about 222 KB raw for any single symbol. The same symbol
through the fixed ESM entry retains only what it imports (`isDefined`: 47 bytes).

Runs also assert packed ESM root/leaf DateTime and Value constructor identity and
cross-entry `instanceof`. They use the new extensionless public leaf paths. The
measurement consumers retain legacy published dist paths for baseline continuity.
