import { email, Email, isEmail } from '../../../src';
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
    expect(email('sander@gmail.com')).toBeValid();
    expect(email(42)).not.toBeValid();
    expect(email({})).not.toBeValid();
  });

  test('trims spaces on construction', () => {
    const valid = 'sander@gmail.com';
    expect(email('sander@gmail.com ')).toBeValid();
    expect(email('sander@gmail.com ').value).toStrictEqual(valid);
    expect(email(' sander@gmail.com').value).toStrictEqual(valid);
    expect(email(' sander@gmail.com ').value).toStrictEqual(valid);
    expect(email(' sander@gmail.com ')).toBeValid();
    expect(email(' sander@gmail .com ').value).not.toBeValid();
  });

  test('to lower case on construction', () => {
    const valid = 'naoufal@gmail.com';
    expect(email('Naoufal@gmail.com ')).toBeValid();
    expect(email('Naoufal@gmail.com ').value).toStrictEqual(valid);
    expect(email('naOufAl@gmaIL.com').value).toStrictEqual(valid);
  });

  test('name', () => {
    expect(email('kim@gmail.com').name).toBe('Kim');
    expect(email('kim.holland@gmail.com').name).toBe('Kim Holland');
    expect(email('kim.van.kooten@gmail.com').name).toBe('Kim Van Kooten');
  });
});
