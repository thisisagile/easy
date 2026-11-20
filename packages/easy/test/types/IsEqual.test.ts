import '@thisisagile/easy-test';
import { Certificate, Dev } from '../ref';
import { isEqual } from '../../src';

describe('IsEqual', () => {
  const func = () => 'Rob';
  const objA = { id: 42 };
  const objB = { id: 42 };

  const cases: [unknown, unknown, boolean][] = [
    [undefined, undefined, true],
    ['', undefined, false],
    ['', '', true],
    ['Sander', '', false],
    ['Sander', 'Sander', true],
    [42, 42, true],
    [42, '42', false],
    [{}, undefined, false],
    [{}, {}, true],
    [{ id: 42 }, {}, false],
    [{ id: 42 }, { id: 42 }, true],
    [{ id: 42 }, { name: 'Sander' }, false],
    [{ id: 42, name: 'Jan' }, { id: 42 }, false],
    [{ id: 42, name: 'Jan' }, { id: 42, name: 'Jan' }, true],
    [{ id: 42, name: 'Jan' }, { id: 42, name: 'Kees' }, false],
    [{ id: 42, name: 'Jan' }, { name: 'Jan', id: 42 }, true],
    [{ id: 42, name: { first: 'Jan', lst: 'Kees' } }, { id: 42, name: 'Jan' }, false],
    [{ id: 42, name: { first: 'Jan', lst: 'Kees' } }, { id: 42, name: { first: 'Jan', lst: 'Kees' } }, true],
    [objA, objA, true],
    [objA, objB, true],
    [objA, { id: 42 }, true],
    [Dev.Sander, Dev.Rob, false],
    [Dev.Sander, Certificate.Flow, false],
    [Dev.Sander, Dev.Sander, true],
    [Dev.Sander, 'Sander', false],
    [Dev.Sander, () => 'Sander', false],
    [func, func, true],
    [() => 'Sander', () => 'Sander', false],
    [() => 'Sander', () => 'Francisco', false],
    [[], undefined, false],
    [[], 3, false],
    [[3], 3, false],
    [[], {}, false],
    [[], { length: 0 }, false],
    [[], Dev.Sander, false],
    [[], [], true],
    [[1], [], false],
    [[1], [2], false],
    [[1, 2], [2], false],
    [[2], [1, 2], false],
    [[2, 1], [2], false],
    [[1, 2], [2, 1], false],
    [[1, 2], [1, 2], true],
    [{}, 3, false],
    [new Date(0), new Date(0), true],
    [new Date(0), new Date(1e12), false],
    [new Date(NaN), new Date(NaN), true],
    [new Date(0), {}, false],
    [{ at: new Date(0) }, { at: new Date(0) }, true],
    [{ at: new Date(0) }, { at: new Date(5) }, false],
    [[new Date(0)], [new Date(5)], false],
    [/a/, /a/, true],
    [/a/, /b/, false],
    [/a/g, /a/i, false],
    [/a/, {}, false],
    [new Map([[1, 2]]), new Map([[1, 2]]), true],
    [new Map([[1, 2]]), new Map([[3, 4]]), false],
    [new Map([[1, 2]]), new Map([[1, 3]]), false],
    [new Map([[1, { id: 42 }]]), new Map([[1, { id: 42 }]]), true],
    [
      new Map([[1, 2]]),
      new Map([
        [1, 2],
        [3, 4],
      ]),
      false,
    ],
    [new Map(), new Set(), false],
    [new Map(), {}, false],
    [new Set([1]), new Set([1]), true],
    [new Set([1]), new Set([2]), false],
    [new Set([1, 2]), new Set([2, 1]), true],
    [new Set([1]), new Set([1, 2]), false],
    [new Set([{ id: 42 }]), new Set([{ id: 42 }]), true],
    [new Set([{ id: 42 }, { id: 42 }]), new Set([{ id: 42 }, { id: 43 }]), false],
    [new Set(), [], false],
  ];

  test.each(cases)(`'%s' = '%s' => %s`, (a, o, r) => {
    expect(isEqual(a, o)).toBe(r);
  });
});
