import '@thisisagile/easy-test';
import { toTotalledList } from '../../src';
import { Dev } from '../ref';

describe('TotalledList', () => {

  test('toTotalledList empty', () => {
    const tl = toTotalledList();
    expect(tl).toBeDefined();
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalledList empty list', () => {
    const tl = toTotalledList([]);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalledList undefined and total', () => {
    const tl = toTotalledList(undefined, 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toTotalledList empty list and total', () => {
    const tl = toTotalledList([], 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toTotalledList list', () => {
    const tl = toTotalledList(Dev.All);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalledList list and total', () => {
    const tl = toTotalledList(Dev.All, 42);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBe(42);
  });
});
