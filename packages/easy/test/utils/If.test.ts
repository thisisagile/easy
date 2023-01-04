import { mock } from '@thisisagile/easy-test';
import { ifDefined, ifFalse, ifNotEmpty, ifTrue } from '../../src';

describe('IfDefined', () => {
  let f: jest.Mock;
  let alt: jest.Mock;

  beforeEach(() => {
    f = mock.return('f');
    alt = mock.return('alt');
  });

  test('call f when defined.', () => {
    expect(
      ifDefined(
        'defined',
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(f).toHaveBeenCalled();
    expect(alt).not.toHaveBeenCalled();
  });

  test('call alt when not defined.', () => {
    expect(
      ifDefined(
        undefined,
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(f).not.toHaveBeenCalled();
    expect(alt).toHaveBeenCalled();
  });

  test('return undefined when alt is not given.', () => {
    expect(ifDefined(undefined, () => f())).toBeUndefined();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('IfNotEmpty', () => {
  let f: jest.Mock;
  let alt: jest.Mock;

  beforeEach(() => {
    f = mock.return('f');
    alt = mock.return('alt');
  });

  test('call f when not empty.', () => {
    expect(
      ifNotEmpty(
        [{}, {}],
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(f).toHaveBeenCalled();
    expect(alt).not.toHaveBeenCalled();
  });

  test('call alt on empty array.', () => {
    expect(
      ifNotEmpty(
        [],
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(f).not.toHaveBeenCalled();
    expect(alt).toHaveBeenCalled();
  });

  test('call alt on empty string.', () => {
    expect(
      ifNotEmpty(
        '',
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(f).not.toHaveBeenCalled();
    expect(alt).toHaveBeenCalled();
  });

  test('return undefined when alt is not given.', () => {
    expect(ifNotEmpty([], () => f())).toBeUndefined();
    expect(f).not.toHaveBeenCalled();
  });

  test('return value tested if f is not given.', () => {
    expect(ifNotEmpty([])).toBeUndefined();
    expect(ifNotEmpty({ name: 'Sander' })).toStrictEqual({ name: 'Sander' });
  });
});

describe('IfTrue', () => {
  let f: jest.Mock;
  let alt: jest.Mock;

  beforeEach(() => {
    f = mock.return('f');
    alt = mock.return('alt');
  });

  test('call f when true', () => {
    expect(
      ifTrue(
        true,
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(f).toHaveBeenCalled();
    expect(alt).not.toHaveBeenCalled();
  });

  test('call f when construct true', () => {
    expect(
      ifTrue(
        () => true,
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(f).toHaveBeenCalled();
    expect(alt).not.toHaveBeenCalled();
  });

  test('call alt when false.', () => {
    expect(
      ifTrue(
        '',
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(f).not.toHaveBeenCalled();
    expect(alt).toHaveBeenCalled();
  });

  test('dont call f when construct false', () => {
    expect(
      ifTrue(
        () => false,
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(f).not.toHaveBeenCalled();
    expect(alt).toHaveBeenCalled();
  });

  test('call alt when undefined', () => {
    expect(
      ifTrue(
        undefined,
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(f).not.toHaveBeenCalled();
    expect(alt).toHaveBeenCalled();
  });

  test('ifTrue returns undefined when alt is not given.', () => {
    expect(ifTrue(false, () => f())).toBeUndefined();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('ifFalse', () => {
  let f: jest.Mock;
  let alt: jest.Mock;

  beforeEach(() => {
    f = mock.return('f');
    alt = mock.return('alt');
  });

  test('call f when true', () => {
    expect(
      ifFalse(
        true,
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(alt).toHaveBeenCalled();
    expect(f).not.toHaveBeenCalled();
  });

  test('call f when construct true', () => {
    expect(
      ifFalse(
        () => true,
        () => f(),
        () => alt()
      )
    ).toBe('alt');
    expect(alt).toHaveBeenCalled();
    expect(f).not.toHaveBeenCalled();
  });

  test('call alt when false.', () => {
    expect(
      ifFalse(
        '',
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(alt).not.toHaveBeenCalled();
    expect(f).toHaveBeenCalled();
  });

  test('dont call f when construct false', () => {
    expect(
      ifFalse(
        () => false,
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(alt).not.toHaveBeenCalled();
    expect(f).toHaveBeenCalled();
  });

  test('call alt when undefined', () => {
    expect(
      ifFalse(
        undefined,
        () => f(),
        () => alt()
      )
    ).toBe('f');
    expect(alt).not.toHaveBeenCalled();
    expect(f).toHaveBeenCalled();
  });

  test('ifTrue returns undefined when alt is not given.', () => {
    expect(ifFalse(true, () => f())).toBeUndefined();
    expect(f).not.toHaveBeenCalled();
  });
});
