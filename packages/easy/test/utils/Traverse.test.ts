import '@thisisagile/easy-test';
import { Audit, traverse } from '../../src';
import { Dev } from '../ref';

describe('traverse', () => {

  test('traverse with empty subject', () => {
    expect(traverse(undefined, '')).toBeUndefined();
  });

  test('traverse with empty property', () => {
    expect(traverse(Dev.Jeroen, '')).toBeUndefined();
  });

  test('traverse with non-existing property', () => {
    expect(traverse(Dev.Jeroen, 'bsn')).toBeUndefined();
  });

  test('traverse with existing property', () => {
    expect(traverse(Dev.Jeroen, 'name')).toBe('Jeroen');
    expect(traverse(Dev.Jeroen, 'created')).toBeInstanceOf(Audit);
  });

  test('traverse with non-existing nested property', () => {
    expect(traverse(Dev.Jeroen, 'created.outOf')).toBeUndefined();
  });

  test('traverse with existing nested property', () => {
    expect(traverse(Dev.Jeroen, 'created.by')).toStrictEqual({ id: 0, user: 'easy' });
  });

  test('traverse with existing double-nested property', () => {
    expect(traverse(Dev.Jeroen, 'created.by.id')).toBe(0);
  });
});
