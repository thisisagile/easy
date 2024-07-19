import '@thisisagile/easy-test';
import { Dev } from '../ref';
import { Jwt as SignJwt } from '@thisisagile/easy-service';

describe('Test Jwt', () => {
  const dev = Dev.Naoufal.toJSON();
  const jwt = SignJwt.sign(dev);

  test('Check if a valid jwt contains the token.', () => {
    expect(jwt).toBeValid();
    expect(jwt.decode().name).toBe(Dev.Naoufal.name);
  });

  test('Decode', () => {
    const res2 = jwt.decode();
    expect(res2).toMatchObject(dev);
  });

  test('toJSON.', () => {
    expect(jwt.toJSON()).toStrictEqual({ jwt: jwt.value });
  });
});
