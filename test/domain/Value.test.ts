import { isValue, Value } from '../../src';
import '@thisisagile/easy-test';
import { Age, Dev } from '../ref';

describe('Value', () => {
  test('check a value', () => {
    const age = new Age(54);
    expect(age.value).toBe(54);
    expect(age.toJSON()).toBe(54);
    expect(age).toMatchText('54');
  });

  test('valid value', () => {
    const age = new Age(54);
    expect(age).toBeValid();
  });

  test('invalid value', () => {
    const age = new Age(128);
    expect(age).not.toBeValid();
  });
});

describe('isValue', () => {
  test('valid', () => {
    expect(isValue(new Age(54))).toBeTruthy();
  });

  test('invalid', () => {
    expect(isValue()).toBeFalsy();
    expect(isValue(Dev.Wouter)).toBeFalsy();
  });
});
