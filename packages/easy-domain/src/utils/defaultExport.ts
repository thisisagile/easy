type Fn = (...args: never[]) => unknown;

// validator's lib modules that also have named exports are `{ default: fn }` objects, which a strict ESM default import receives as is
export const defaultExport = <F extends Fn>(module: F | { default: F }): F => (typeof module === 'function' ? module : module.default);
