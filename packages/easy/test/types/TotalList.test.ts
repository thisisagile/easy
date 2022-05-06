import '@thisisagile/easy-test';
import { toTotalList } from '../../src';
import { Dev } from '../ref';

describe('TotalList', () => {

  test('toTotalList empty', () => {
    const tl = toTotalList();
    expect(tl).toBeDefined();
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalList empty list', () => {
    const tl = toTotalList([]);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalList undefined and total', () => {
    const tl = toTotalList(undefined, 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toTotalList empty list and total', () => {
    const tl = toTotalList([], 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toTotalList list', () => {
    const tl = toTotalList(Dev.All);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBeUndefined();
  });

  test('toTotalList list and total', () => {
    const tl = toTotalList(Dev.All, 42);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBe(42);
  });
});
