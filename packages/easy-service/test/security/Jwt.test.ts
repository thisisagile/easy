import '@thisisagile/easy-test';
import { Jwt } from '../../src';
import { validate } from '@thisisagile/easy';
import { Dev } from '@thisisagile/easy/test/ref';

describe('Test Jwt', () => {
  const dev = Dev.Naoufal.toJSON();
  const jwt = Jwt.sign(dev);
  const falseJwt = Jwt.of({ jwt: 'wrong' });

  test('Check if a valid jwt contains the token.', () => {
    expect(jwt).toBeValid();
    expect(jwt.decode().name).toBe(Dev.Naoufal.name);
  });

  test('Decode', () => {
    const res2 = jwt.decode();
    expect(res2).toMatchObject(dev);
  });

  test('Validate', () => {
    expect(validate(jwt)).toBeValid();
    expect(validate(falseJwt)).not.toBeValid();
  });

  test('toJSON.', () => {
    expect(jwt.toJSON()).toStrictEqual({ jwt: jwt.value });
  });

  test('Sign with options', () => {
    const jwt = Jwt.sign(dev, { audience: 'audience', issuer: 'issuer' });
    expect(jwt.decode().iss).toBe('issuer');
    expect(jwt.decode().aud).toBe('audience');
  });
});
