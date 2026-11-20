import { isArray, isObject } from './Is';
import { choose } from './Case';

const tagOf = (o: unknown): string => Object.prototype.toString.call(o);

const isEqualArray = (one: unknown[], another: unknown[]): boolean =>
  choose([one, another])
    .case(([o, a]) => !isArray(o) || !isArray(a), false)
    .case(([o, a]) => o?.length !== a?.length, false)
    .else(([o, a]) => !o.some((v, i) => !isEqual(v, a[i])));

const isEqualMap = (one: Map<unknown, unknown>, another: Map<unknown, unknown>): boolean =>
  one.size === another.size && [...one].every(([k, v]) => another.has(k) && isEqual(v, another.get(k)));

const isEqualSet = (one: Set<unknown>, another: Set<unknown>): boolean => {
  if (one.size !== another.size) return false;
  const rest = [...another];
  return [...one].every(v => {
    const i = rest.findIndex(r => isEqual(v, r));
    return i >= 0 && rest.splice(i, 1).length === 1;
  });
};

const isEqualObject = (one: any, another: any): boolean =>
  choose([Object.keys(one), Object.keys(another)])
    .case(([keysO, keysA]) => keysO.length !== keysA.length, false)
    .case(([keysO, keysA]) => keysO.some(k => !keysA.includes(k)), false)
    .case(([keysO]) => keysO.some(k => !isEqual(one[k], another[k])), false)
    .else(true);

export const isEqual = (one?: unknown, another?: unknown): boolean =>
  choose([one, another])
    .case(([o, a]) => o === a, true)
    .case(
      ([o, a]) => isArray(o) || isArray(a),
      ([o, a]) => isEqualArray(o as [], a as [])
    )
    .case(
      ([o, a]) => o == null || a == null || (!isObject(o) && !isObject(a)),
      ([o, a]) => o !== o && a !== a
    )
    .case(([o, a]) => tagOf(o) !== tagOf(a), false)
    .case(
      ([o]) => o instanceof Date,
      ([o, a]) => isEqual((o as Date).getTime(), (a as Date).getTime())
    )
    .case(
      ([o]) => o instanceof RegExp,
      ([o, a]) => (o as RegExp).source === (a as RegExp).source && (o as RegExp).flags === (a as RegExp).flags
    )
    .case(
      ([o]) => o instanceof Map,
      ([o, a]) => isEqualMap(o as Map<unknown, unknown>, a as Map<unknown, unknown>)
    )
    .case(
      ([o]) => o instanceof Set,
      ([o, a]) => isEqualSet(o as Set<unknown>, a as Set<unknown>)
    )
    .else(([o, a]) => isEqualObject(o, a));
