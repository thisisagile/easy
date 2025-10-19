import '@thisisagile/easy-test';
import { Jwt } from '../../src';

describe('Test Jwt', () => {
  const jwt = new Jwt('dummy-jwt-token'); // This would need to be a real JWT token for proper testing

  test('Check if a valid jwt contains the token.', () => {
    expect(jwt).toBeValid();
  });

  test('toJSON.', () => {
    expect(jwt.toJSON()).toStrictEqual({ jwt: jwt.value });
  });
});
