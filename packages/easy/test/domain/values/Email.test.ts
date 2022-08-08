import { email, Email, isEmail } from '../../../src';
import '@thisisagile/easy-test';

const mail = 'wouter@gmail.com';

describe('isEmail', () => {
  test('invalid', () => {
    expect(isEmail()).toBeFalsy();
    expect(isEmail('')).toBeFalsy();
    expect(isEmail('sander')).toBeFalsy();
    expect(isEmail('sander@')).toBeFalsy();
    expect(isEmail('sander@nl')).toBeFalsy();
  });

  test('valid', () => {
    expect(isEmail(mail)).toBeTruthy();
  });
});

describe('Email', () => {
  test('invalid', () => {
    expect(new Email('')).not.toBeValid();
    expect(isEmail('sander@nl')).not.toBeValid();
  });

  test('valid', () => {
    expect(email(mail)).toBeValid();
    expect(email(42)).not.toBeValid();
    expect(email({})).not.toBeValid();
  });

  test('trims spaces on construction', () => {
    expect(email('kim@gmail.com  ')).toBeValid();
    expect(email('rob@gmail.com ').value).toBe('rob@gmail.com');
    expect(email(' jeroen@gmail.com').value).toBe('jeroen@gmail.com');
    expect(email(' wouter@gmail.com ').value).toStrictEqual(mail);
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
