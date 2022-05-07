import { isArray, isObject } from './Is';
import { choose } from './Case';

const isEqualArray = (one: unknown[], another: unknown[]): boolean =>
  choose([one, another])
    .case(
      ([o, a]) => !isArray(o) || !isArray(a),
      () => false
    )
    .case(
      ([o, a]) => o?.length !== a?.length,
      () => false
    )
    .else(([o, a]) => !o.some((v, i) => !isEqual(v, a[i])));

const isEqualObject = (one: any, another: any): boolean =>
  choose([Object.keys(one), Object.keys(another)])
    .case(
      ([keysO, keysA]) => keysO.length !== keysA.length,
      () => false
    )
    .case(
      ([keysO, keysA]) => keysO.some(k => !keysA.includes(k)),
      () => false
    )
    .case(
      ([keysO]) => keysO.some(k => !isEqual(one[k], another[k])),
      () => false
    )
    .else(true);

export const isEqual = (one?: unknown, another?: unknown): boolean =>
  choose([one, another])
    .case(
      ([o, a]) => o === a,
      () => true
    )
    .case(
      ([o, a]) => isArray(o) || isArray(a),
      ([o, a]) => isEqualArray(o as [], a as [])
    )
    .case(
      ([o, a]) => o == null || a == null || (!isObject(o) && !isObject(a)),
      ([o, a]) => o !== o && a !== a
    )
    .else(([o, a]) => isEqualObject(o, a));
