import '@thisisagile/easy-test';
import { toTotalList } from '../../src';
import { Dev } from '../ref';

describe('TotalledList', () => {

  test('toTotalledList empty', () => {
    const tl = toTotalList();
    expect(tl).toBeDefined();
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalledList empty list', () => {
    const tl = toTotalList([]);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalledList undefined and total', () => {
    const tl = toTotalList(undefined, 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toTotalledList empty list and total', () => {
    const tl = toTotalList([], 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toTotalledList list', () => {
    const tl = toTotalList(Dev.All);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalledList list and total', () => {
    const tl = toTotalList(Dev.All, 42);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBe(42);
  });
});
