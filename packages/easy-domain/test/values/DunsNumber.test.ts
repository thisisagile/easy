import { duns, DunsNumber, isDunsNumber } from '../../src';
import '@thisisagile/easy-test';

describe('DunsNumber', () => {
  test('value', () => {
    expect(new DunsNumber('123456789')).toBeValid();
    expect(new DunsNumber('123456789').value).toBe('123456789');
    expect(duns(' 000000001 ')).toMatchText('000000001')
    expect(duns('023456789')).toMatchText('023456789');
  });

  test('isDunsNumber invalid', () => {
    expect(isDunsNumber()).toBeFalsy();
    expect(isDunsNumber('')).toBeFalsy();
    expect(isDunsNumber('0')).toBeFalsy();
    expect(isDunsNumber('12345678')).toBeFalsy();
    expect(isDunsNumber('1234567890')).toBeFalsy();
    expect(isDunsNumber('123 456 789')).toBeFalsy();
    expect(isDunsNumber('12a456789')).toBeFalsy();
  });

  test('isDunsNumber valid', () => {
    expect(isDunsNumber('123456789')).toBeTruthy();
    expect(isDunsNumber('000000001')).toBeTruthy();
    expect(isDunsNumber('023456789')).toBeTruthy();
  });
});


