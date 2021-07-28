import { Email, isEmail } from '../../../src';
import '@thisisagile/easy-test';

describe('isEmail', () => {
  test('invalid', () => {
    expect(isEmail()).toBeFalsy();
    expect(isEmail('')).toBeFalsy();
    expect(isEmail('sander')).toBeFalsy();
    expect(isEmail('sander@')).toBeFalsy();
    expect(isEmail('sander@nl')).toBeFalsy();
  });

  test('valid', () => {
    expect(isEmail('sander@gmail.com')).toBeTruthy();
  });
});

describe('Email', () => {
  test('invalid', () => {
    expect(new Email('')).not.toBeValid();
    expect(isEmail('sander@nl')).not.toBeValid();
  });

  test('valid', () => {
    expect(new Email('sander@gmail.com')).toBeValid();
  });

  test('name', () => {
    expect(new Email('kim@gmail.com').name).toBe('Kim');
    expect(new Email('kim.holland@gmail.com').name).toBe('Kim Holland');
    expect(new Email('kim.van.kooten@gmail.com').name).toBe('Kim Van Kooten');
  });
});
