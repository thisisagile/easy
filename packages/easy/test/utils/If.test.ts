import { mock } from '@thisisagile/easy-test';
import { ifDefined, ifNotEmpty } from '../../src';

describe('IfDefined', () => {
  let f: jest.Mock;
  let alt: jest.Mock;

  beforeEach(() => {
    f  = mock.return('f');
    alt = mock.return('alt');
  });

  test('call f when defined.', () => {
    expect(ifDefined('defined', () => f(), () => alt())).toBe('f');
    expect(f).toBeCalled();
    expect(alt).not.toBeCalled();
  });

  test('call alt when not defined.', () => {
    expect(ifDefined(undefined, () => f(), () => alt())).toBe('alt');
    expect(f).not.toBeCalled();
    expect(alt).toBeCalled();
  });

  test('return undefined when alt is not given.', () => {
    expect(ifDefined(undefined, () => f())).toBeUndefined();
    expect(f).not.toBeCalled();
  });
});

describe('IfNotEmpty', () => {
  let f: jest.Mock;
  let alt: jest.Mock;

  beforeEach(() => {
    f  = mock.return('f');
    alt = mock.return('alt');
  });

  test('call f when not empty.', () => {
    expect(ifNotEmpty([{}, {}], () => f(), () => alt())).toBe('f');
    expect(f).toBeCalled();
    expect(alt).not.toBeCalled();
  });

  test('call alt on empty array.', () => {
    expect(ifNotEmpty([], () => f(), () => alt())).toBe('alt');
    expect(f).not.toBeCalled();
    expect(alt).toBeCalled();
  });

  test('call alt on empty string.', () => {
    expect(ifNotEmpty('', () => f(), () => alt())).toBe('alt');
    expect(f).not.toBeCalled();
    expect(alt).toBeCalled();
  });

  test('return undefined when alt is not given.', () => {
    expect(ifNotEmpty([], () => f())).toBeUndefined();
    expect(f).not.toBeCalled();
  });
});