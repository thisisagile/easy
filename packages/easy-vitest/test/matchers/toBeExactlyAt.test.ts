import { describe, expect, test } from 'vitest';
import { Tester, UseCase } from '../../src/utils/Types';
import { toBeExactlyAt } from '../../src';

describe('toBeAt', () => {
  const tester: Tester = { url: 'http://localhost:1337/profiles/find-profile' };
  const tester2: Tester = { url: undefined as unknown as string };
  const uc: UseCase = { app: { id: 'profiles' }, id: 'find-profile' };
  const uc2: UseCase = { app: { id: 'shops' }, id: 'manage-shop' };

  test('tester is undefined', () => {
    expect(toBeExactlyAt(undefined as unknown as Tester, uc)).toFailMatcherWith('Tester is undefined');
  });

  test('url in tester is undefined', () => {
    expect(toBeExactlyAt(tester2, uc)).toFailMatcherWith('Tester does not contain a URL');
  });

  test('uc is undefined', () => {
    expect(toBeExactlyAt(tester, undefined as unknown as UseCase)).toFailMatcherWith('Use case is undefined');
  });

  test('uc doesnt match tester', () => {
    expect(toBeExactlyAt(tester, uc2)).toFailMatcherWith(
      "We expected the tester to be at: '/shops/manage-shop', but it is at: 'http://localhost:1337/profiles/find-profile' instead."
    );
  });

  test('uc and id doesnt match tester', () => {
    expect(toBeExactlyAt(tester, uc, 42)).toFailMatcherWith(
      "We expected the tester to be at: '/profiles/find-profile/42', but it is at: 'http://localhost:1337/profiles/find-profile' instead."
    );
  });

  test('uc matches tester', () => {
    expect(toBeExactlyAt(tester, uc)).toPassMatcherWith("The tester is at 'http://localhost:1337/profiles/find-profile'");
  });
});
