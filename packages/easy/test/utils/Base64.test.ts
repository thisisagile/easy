import { base64 } from '../../src';

describe('Base64', () => {
  test('created', () => {
    const b64 = base64.encode('Hello world');
    expect(b64).toBe('SGVsbG8gd29ybGQ=');
    expect(base64.decode(b64)).toBe('Hello world');
  });

  test('toJson', () => {
    const b64 = base64.encode('{"hello": "world"}');
    expect(base64.toJson(b64)).toStrictEqual({ hello: 'world' });
  });
});
