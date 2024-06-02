import '@thisisagile/easy-test';
import sign from 'jsonwebtoken';

import { ctx, Jwt } from '../../src';
import { Dev } from '../ref';

describe('Test Jwt', () => {
  const dev = Dev.Naoufal.toJSON();
  const jwt = Jwt.of({ jwt: sign.sign(dev, ctx.env.get('tokenPrivateKey') as string) });

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
