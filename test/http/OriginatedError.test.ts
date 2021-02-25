import { ContentType, isOriginatedError, OriginatedError } from '../../src';
import { Dev } from '../ref';

describe('OriginatedError', () => {
  test('isOriginatedError', () => {
    expect(isOriginatedError()).toBeFalsy();
    expect(isOriginatedError('')).toBeFalsy();
    expect(isOriginatedError(Dev.Wouter)).toBeFalsy();
    expect(isOriginatedError(new Error())).toBeFalsy();
    expect(isOriginatedError(new OriginatedError(''))).toBeTruthy();
  });

  test('origin', () => {
    const dev = Dev.Wouter;
    expect(new OriginatedError(dev).origin).toBe(dev);
    expect(new OriginatedError(dev, { type: ContentType.Json }).options.type).toBe(ContentType.Json);
  });
});
