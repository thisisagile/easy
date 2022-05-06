import '@thisisagile/easy-test';
import { toPageList } from '../../src';
import { Dev } from '../ref';

describe('PageList', () => {

  test('toPageList empty', () => {
    const tl = toPageList();
    expect(tl).toBeDefined();
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toPageList empty list', () => {
    const tl = toPageList([]);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBeUndefined();
  });

  test('toPageList undefined and total', () => {
    const tl = toPageList(undefined, 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toPageList empty list and total', () => {
    const tl = toPageList([], 42);
    expect(tl).toHaveLength(0);
    expect(tl.total).toBe(42);
  });

  test('toPageList list', () => {
    const tl = toPageList(Dev.All);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBeUndefined();
  });

  test('toPageList list and total', () => {
    const tl = toPageList(Dev.All, 42);
    expect(tl).toHaveLength(Dev.All.length);
    expect(tl.total).toBe(42);
  });
});
