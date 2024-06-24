import { ContentType, toResults } from '@thisisagile/easy';
import { Dev } from '@thisisagile/easy/test/ref';
import { isOriginatedError, OriginatedError, toOriginatedError } from '../../src/http';

describe('OriginatedError', () => {
  test('origin', () => {
    const dev = Dev.Wouter;
    expect(new OriginatedError(dev).origin).toBe(dev);
    expect(new OriginatedError(dev, { type: ContentType.Json }).options?.type).toBe(ContentType.Json);
  });
});

describe('isOriginatedError', () => {
  test('isOriginatedError', () => {
    expect(isOriginatedError()).toBeFalsy();
    expect(isOriginatedError('')).toBeFalsy();
    expect(isOriginatedError(Dev.Wouter)).toBeFalsy();
    expect(isOriginatedError(new Error())).toBeFalsy();
    expect(isOriginatedError(new OriginatedError(''))).toBeTruthy();
  });
});

describe('toOriginatedError', () => {
  test('from originated error', () => {
    const e = new OriginatedError(Dev.Naoufal);
    expect(toOriginatedError(e)).toEqual(e);
  });

  test('from results', () => {
    const res = toResults('Something is wrong');
    const e = toOriginatedError(res);
    expect(e).toBeInstanceOf(OriginatedError);
    expect(e.origin).toEqual(res);
  });

  test('keep stack trace', () => {
    const e = new Error();
    expect(toOriginatedError(e).stack).toBe(e.stack);
  });
});
