import { mock } from '@thisisagile/easy-test';
import { ifDefined } from '../../src';

describe('If', () => {

  test('call f when defined.', () => {
    const f  = mock.return('f');
    const alt = mock.return('alt');
    expect(ifDefined('defined', () => f(), () => alt())).toBe('f');
    expect(f).toBeCalled();
    expect(alt).not.toBeCalled();
  });

  test('call alt when not defined.', () => {
    const f = mock.return('f');
    const alt = mock.return('alt');
    expect(ifDefined(undefined, () => f(), () => alt())).toBe('alt');
    expect(f).not.toBeCalled();
    expect(alt).toBeCalled();
  });

  test('return undefined when alt is not given.', () => {
    const f = mock.return('f');
    expect(ifDefined(undefined, () => f())).toBeUndefined();
    expect(f).not.toBeCalled();
  });
});