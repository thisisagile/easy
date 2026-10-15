// Only inputs contributing bytes to output are retained; parsed-but-shaken inputs are excluded.
export function summarize(metafile, ownPackage) {
  const retained = new Map();
  for (const output of Object.values(metafile.outputs)) {
    for (const [path, input] of Object.entries(output.inputs)) {
      if (input.bytesInOutput > 0) retained.set(path, (retained.get(path) ?? 0) + input.bytesInOutput);
    }
  }
  const modules = [...retained]
    .filter(([path]) => path.includes('node_modules/'))
    .map(([path, bytes]) => ({ path: path.slice(path.indexOf('node_modules/')), bytes }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const packages = [...new Set(modules.map(({ path }) => packageName(path)))].filter(name => name !== ownPackage).sort();
  return {
    retainedModules: modules.filter(({ path }) => packageName(path) === ownPackage),
    retainedThirdPartyPackages: packages,
    retainedDependencyModules: modules.filter(({ path }) => packageName(path) !== ownPackage),
    externalImports: [...new Set(Object.values(metafile.outputs).flatMap(output => output.imports.filter(i => i.external).map(i => i.path)))].sort(),
  };
}

function packageName(path) {
  const parts = path.split('node_modules/').at(-1).split('/');
  return parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}
