import { describe, expect, test } from 'vitest';
import { Tester, UseCase } from '../../src/utils/Types';
import { toBeAt } from '../../src';

describe('toBeAt', () => {
  const tester: Tester = { url: 'http://localhost:1337/profiles/find-profile' };
  const tester2: Tester = { url: undefined as unknown as string };
  const tester3: Tester = { url: 'http://localhost:1337/profiles/find-profile/42' };
  const uc: UseCase = { app: { id: 'profiles' }, id: 'find-profile' };
  const uc2: UseCase = { app: { id: 'shops' }, id: 'manage-shop' };
  const uc3: UseCase = { app: { id: 'profiles' }, id: 'manage-profile' };

  test('tester is undefined', () => {
    expect(toBeAt(undefined as unknown as Tester, uc)).toFailMatcherWith('Tester is undefined');
  });

  test('url in tester is undefined', () => {
    expect(toBeAt(tester2, uc)).toFailMatcherWith('Tester does not contain a URL');
  });

  test('uc is undefined', () => {
    expect(toBeAt(tester, undefined as unknown as UseCase)).toFailMatcherWith('Use case is undefined');
  });

  test('uc doesnt match tester', () => {
    expect(toBeAt(tester, uc2)).toFailMatcherWith(
      "We expected the tester to be at app 'shops', but it is at 'http://localhost:1337/profiles/find-profile' instead."
    );
  });

  test('uc doesnt match tester, but matches app', () => {
    expect(toBeAt(tester, uc3)).toFailMatcherWith(
      "We expected the tester to be at use case 'manage-profile', but it is at 'http://localhost:1337/profiles/find-profile' instead."
    );
  });

  test('uc and id doesnt match tester', () => {
    expect(toBeAt(tester, uc, 42)).toFailMatcherWith("We expected the path to contain '/42', but it is 'http://localhost:1337/profiles/find-profile' instead.");
  });

  test('uc matches tester', () => {
    expect(toBeAt(tester, uc)).toPassMatcherWith("The tester is at 'http://localhost:1337/profiles/find-profile'");
  });

  test('uc plus id matches tester', () => {
    expect(toBeAt(tester3, uc, 42)).toPassMatcherWith("The tester is at 'http://localhost:1337/profiles/find-profile/42'");
  });
});
